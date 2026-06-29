import { supabase } from './supabaseClient';

export type Store = 'amazon' | 'rakuten' | 'yahoo' | 'aliexpress';

function deviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
  if (/Android/i.test(ua)) return 'Android';
  return 'PC';
}

function referrerName(): string {
  const ref = document.referrer || '';
  if (!ref) return 'direct';
  if (/instagram/i.test(ref)) return 'instagram';
  if (/youtu/i.test(ref)) return 'youtube';
  if (/tiktok/i.test(ref)) return 'tiktok';
  if (/note\.com/i.test(ref)) return 'note';
  if (/t\.co|twitter|x\.com/i.test(ref)) return 'x';
  if (/lin\.ee|line/i.test(ref)) return 'line';
  try { return new URL(ref).hostname; } catch { return 'other'; }
}

/** クリックを記録（fire-and-forget。失敗してもユーザー体験は止めない） */
export function logClick(itemId: number | undefined, store: Store): void {
  if (!supabase || itemId == null) return;
  void supabase
    .from('clicks')
    .insert({
      item_id: itemId,
      store,
      device: deviceType(),
      referrer: referrerName(),
      user_agent: navigator.userAgent.slice(0, 300),
    })
    .then(
      () => {},
      () => {},
    );
}
