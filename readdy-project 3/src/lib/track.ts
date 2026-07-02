import { supabase } from './supabaseClient';

export type Store = 'amazon' | 'rakuten' | 'yahoo' | 'aliexpress';

// ============================================================
// 基本情報の取得
// ============================================================

function deviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
  if (/Android/i.test(ua)) return 'Android';
  return 'PC';
}

const SOURCE_PATTERNS: [RegExp, string][] = [
  [/instagram|ig/i, 'instagram'],
  [/youtu|yt/i, 'youtube'],
  [/tiktok|tt/i, 'tiktok'],
  [/note/i, 'note'],
  [/^x$|t\.co|twitter|x\.com/i, 'x'],
  [/lin\.ee|line/i, 'line'],
];

/** 流入元を判定（UTMパラメータ最優先 → リファラー → direct） */
function detectSource(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get('utm_source') || params.get('src');
    if (utm) {
      const u = utm.toLowerCase().trim();
      for (const [re, name] of SOURCE_PATTERNS) if (re.test(u)) return name;
      return u.slice(0, 40);
    }
  } catch { /* noop */ }
  const ref = document.referrer || '';
  if (!ref) return 'direct';
  if (/instagram/i.test(ref)) return 'instagram';
  if (/youtu/i.test(ref)) return 'youtube';
  if (/tiktok/i.test(ref)) return 'tiktok';
  if (/note\.com/i.test(ref)) return 'note';
  if (/t\.co|twitter|x\.com/i.test(ref)) return 'x';
  if (/lin\.ee|line\.me/i.test(ref)) return 'line';
  try {
    const h = new URL(ref).hostname;
    return h === window.location.hostname ? 'direct' : h.slice(0, 40);
  } catch {
    return 'other';
  }
}

function isBot(): boolean {
  const ua = navigator.userAgent;
  if (/bot|crawler|spider|crawling|prerender|headless|lighthouse|facebookexternalhit|slurp|bingpreview/i.test(ua)) return true;
  return navigator.webdriver === true;
}

// ============================================================
// セッション（タブ単位の訪問。sessionStorageで保持）
// ============================================================

function makeUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

let cachedSid: string | null = null;
let cachedSrc: string | null = null;

function session(): { sid: string; src: string } {
  if (cachedSid && cachedSrc) return { sid: cachedSid, src: cachedSrc };
  try {
    cachedSid = sessionStorage.getItem('izk_sid');
    cachedSrc = sessionStorage.getItem('izk_src');
    if (!cachedSid) {
      cachedSid = makeUuid();
      sessionStorage.setItem('izk_sid', cachedSid);
    }
    if (!cachedSrc) {
      cachedSrc = detectSource();
      sessionStorage.setItem('izk_src', cachedSrc);
    }
  } catch {
    cachedSid = cachedSid ?? makeUuid();
    cachedSrc = cachedSrc ?? detectSource();
  }
  return { sid: cachedSid, src: cachedSrc };
}

// ============================================================
// 送信（keepalive付きfetch：ページ離脱時も送信が生き残る）
// ============================================================

function beacon(table: string, rows: unknown): void {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return;
  try {
    void fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      keepalive: true,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(rows),
    }).catch(() => {});
  } catch { /* noop */ }
}

// ============================================================
// クリック計測（既存互換＋セッション/ソース付与）
// ============================================================

/** クリックを記録（fire-and-forget。失敗してもユーザー体験は止めない） */
export function logClick(itemId: number | undefined, store: Store): void {
  if (!supabase || itemId == null || isBot()) return;
  const { sid, src } = session();
  void supabase
    .from('clicks')
    .insert({
      item_id: itemId,
      store,
      device: deviceType(),
      referrer: src,
      source: src,
      session_id: sid,
      user_agent: navigator.userAgent.slice(0, 300),
    })
    .then(
      () => {},
      () => {},
    );
}

// ============================================================
// ページビュー（アクセス）計測 ＋ 滞在時間トラッキング
// ============================================================

let pvSent = false;

/** ページビューを記録し、滞在時間の計測を開始（1回だけ実行される） */
export function logPageView(): void {
  if (pvSent || isBot()) return;
  if (window.location.pathname.startsWith('/admin')) return;
  pvSent = true;
  const { sid, src } = session();
  beacon('page_views', {
    session_id: sid,
    source: src,
    device: deviceType(),
    path: window.location.pathname,
    user_agent: navigator.userAgent.slice(0, 300),
  });
  startDwell();
}

// --- 滞在時間：画面が見えている間だけ1秒ずつ加算し、節目ごとに記録 ---

let dwellStarted = false;
let activeSec = 0;
let lastSentSec = 0;
const CHECKPOINTS = [10, 30, 60, 120, 180, 300, 420, 600, 900, 1200, 1800, 2700, 3600];

function sendPing(): void {
  if (activeSec <= lastSentSec) return;
  lastSentSec = activeSec;
  const { sid } = session();
  beacon('pings', { session_id: sid, seconds: activeSec });
}

function startDwell(): void {
  if (dwellStarted) return;
  dwellStarted = true;
  let next = 0;
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      activeSec += 1;
      if (next < CHECKPOINTS.length && activeSec >= CHECKPOINTS[next]) {
        next += 1;
        sendPing();
      }
    }
  }, 1000);
  const onLeave = () => {
    if (activeSec >= 3 && activeSec > lastSentSec) sendPing();
    flushImpressions();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') onLeave();
  });
  window.addEventListener('pagehide', onLeave);
}

// ============================================================
// 商品インプレッション計測（カードが画面に35%以上表示されたら1回）
// ============================================================

let seenLoaded = false;
const seenIds = new Set<number>();
let impQueue: number[] = [];
let impTimer: number | null = null;

function loadSeen(): void {
  if (seenLoaded) return;
  seenLoaded = true;
  try {
    const raw = sessionStorage.getItem('izk_seen');
    if (raw) (JSON.parse(raw) as number[]).forEach((n) => seenIds.add(n));
  } catch { /* noop */ }
}

function saveSeen(): void {
  try {
    sessionStorage.setItem('izk_seen', JSON.stringify([...seenIds].slice(-500)));
  } catch { /* noop */ }
}

function flushImpressions(): void {
  if (impQueue.length === 0) return;
  const { sid } = session();
  const rows = impQueue.map((id) => ({ session_id: sid, item_id: id }));
  impQueue = [];
  beacon('impressions', rows);
}

function markImpression(itemId: number): void {
  if (isBot()) return;
  loadSeen();
  if (seenIds.has(itemId)) return;
  seenIds.add(itemId);
  saveSeen();
  impQueue.push(itemId);
  if (impTimer == null) {
    impTimer = window.setTimeout(() => {
      impTimer = null;
      flushImpressions();
    }, 4000);
  }
}

let io: IntersectionObserver | null = null;
const ioIds = new WeakMap<Element, number>();

/** 商品カードのrefに渡すと、画面に表示された時点でインプレッションを記録 */
export function observeImpression(el: Element | null, itemId: number | undefined): void {
  if (!el || itemId == null) return;
  if (typeof IntersectionObserver === 'undefined') return;
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = ioIds.get(e.target);
            if (id != null) markImpression(id);
            io?.unobserve(e.target);
          }
        }
      },
      { threshold: 0.35 },
    );
  }
  ioIds.set(el, itemId);
  io.observe(el);
}
