import { supabase, isSupabaseConfigured } from './supabaseClient';
import { products as mockProducts, type Product } from '@/mocks/products';

// 画像配信をCloudflare(無料CDN)経由にするホスト。空文字にすればSupabase直に戻る。
const IMAGE_CDN_HOST = 'iimono-img.iimonozukan.workers.dev';

/** Supabaseの公開URLを、CDN(ホスト差し替え)経由のURLに変換する */
function toCdnUrl(publicUrl: string): string {
  if (!IMAGE_CDN_HOST) return publicUrl;
  try {
    const u = new URL(publicUrl);
    u.host = IMAGE_CDN_HOST;
    u.protocol = 'https:';
    return u.toString();
  } catch {
    return publicUrl;
  }
}

export type Item = Product & {
  id?: number;
  isPublished?: boolean;
  sortOrder?: number;
  pinnedAt?: string | null;
};

type ItemRow = {
  id: number;
  name: string;
  category: Product['category'];
  image_url: string | null;
  date: string | null;
  amazon_url: string | null;
  rakuten_url: string | null;
  yahoo_url: string | null;
  aliexpress_url: string | null;
  asin: string | null;
  sort_order: number;
  is_published: boolean;
  pinned_at?: string | null;
};

function rowToItem(r: ItemRow): Item {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    image: r.image_url ?? '',
    date: r.date ?? '',
    asin: r.asin ?? undefined,
    isPublished: r.is_published,
    sortOrder: r.sort_order,
    pinnedAt: r.pinned_at ?? null,
    links: {
      amazon: r.amazon_url,
      rakuten: r.rakuten_url,
      yahoo: r.yahoo_url,
      aliexpress: r.aliexpress_url,
    },
  };
}

export type ItemInput = {
  name: string;
  category: Product['category'];
  image: string;
  date: string;
  asin?: string | null;
  isPublished: boolean;
  links: Product['links'];
};

function inputToRow(input: ItemInput) {
  return {
    name: input.name,
    category: input.category,
    image_url: input.image || null,
    date: input.date || null,
    asin: input.asin || null,
    is_published: input.isPublished,
    amazon_url: input.links.amazon,
    rakuten_url: input.links.rakuten,
    yahoo_url: input.links.yahoo,
    aliexpress_url: input.links.aliexpress,
  };
}

/** 公開サイト用：公開中の商品（Supabase未設定 or 失敗時は同梱mocksにフォールバック） */
export async function fetchPublishedItems(): Promise<Item[]> {
  if (!isSupabaseConfigured || !supabase) return mockProducts as Item[];
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) {
    if (error) console.warn('[db] fetchPublishedItems fallback to mocks:', error.message);
    return mockProducts as Item[]; // DBが空/未設定でも既存159件を表示
  }
  return (data as ItemRow[]).map(rowToItem);
}

/** 管理用：全商品（下書き含む） */
export async function fetchAllItems(): Promise<Item[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as ItemRow[]).map(rowToItem);
}

/** 新規作成。作成された商品のidを返す */
export async function createItem(input: ItemInput): Promise<number | null> {
  if (!supabase) throw new Error('Supabase未設定');
  const { data, error } = await supabase
    .from('items')
    .insert(inputToRow(input))
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: number } | null)?.id ?? null;
}

export async function updateItem(id: number, input: ItemInput): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase
    .from('items')
    .update({ ...inputToRow(input), updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** ピン留め（インスタ風・最大3件は呼び出し側でチェック） */
export async function setPinned(id: number, pinned: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase
    .from('items')
    .update({ pinned_at: pinned ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}

// ============================================================
// バナー（トップに2枠・管理画面から設定）
// ============================================================

export type Banner = {
  id: number;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
};

export async function fetchBanners(): Promise<Banner[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('banners').select('*').order('id');
  if (error) return [];
  return (data ?? []) as Banner[];
}

export async function saveBanner(b: Banner): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase
    .from('banners')
    .update({ image_url: b.image_url, link_url: b.link_url, is_active: b.is_active, updated_at: new Date().toISOString() })
    .eq('id', b.id);
  if (error) throw error;
}

export async function setPublished(id: number, isPublished: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase.from('items').update({ is_published: isPublished }).eq('id', id);
  if (error) throw error;
}

export async function deleteItem(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
}

/** 並び順をまとめて更新（25件ずつに分割して負荷を抑える） */
export async function updateSortOrders(updates: { id: number; sortOrder: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const CHUNK = 25;
  for (let i = 0; i < updates.length; i += CHUNK) {
    await Promise.all(
      updates
        .slice(i, i + CHUNK)
        .map((u) => supabase!.from('items').update({ sort_order: u.sortOrder }).eq('id', u.id)),
    );
  }
}

/**
 * 商品保存時の自動配置：リスト全体を「紹介日の新しい順」に安定ソートして正規化する。
 * ・同じ日付の商品どうしは現在の並び（ドラッグでの微調整）を維持
 * ・日付なしは末尾
 * ・過去に並びが乱れていても、保存のたびに全体が正しい日付順に直る
 */
export async function placeItemByDate(id: number, date: string): Promise<void> {
  if (!supabase || !date) return;
  const items = await fetchAllItems();
  if (items.length === 0) return;

  const withNew = items.map((i) => (i.id === id ? { ...i, date } : i));
  const sorted = withNew
    .map((it, k) => ({ it, k }))
    .sort((a, b) => {
      const da = a.it.date || '0000-00-00';
      const db = b.it.date || '0000-00-00';
      if (da !== db) return db < da ? -1 : 1; // 新しい日付が上
      return a.k - b.k; // 同日は現在の並びを維持（安定）
    })
    .map((x) => x.it);

  const updates: { id: number; sortOrder: number }[] = [];
  sorted.forEach((it, k) => {
    if (it.id != null && it.sortOrder !== k) updates.push({ id: it.id, sortOrder: k });
  });
  if (updates.length > 0) await updateSortOrders(updates);
}

/**
 * 商品を複製して「下書き」として即作成し、新しいidを返す。
 * （複製ボタン → この関数 → コピーの編集画面、という流れで使う。元の商品には一切触れない）
 */
export async function duplicateItem(source: Item): Promise<number | null> {
  if (!supabase) throw new Error('Supabase未設定');
  const { data, error } = await supabase
    .from('items')
    .insert({
      name: source.name,
      category: source.category,
      image_url: source.image || null,
      date: source.date || null,
      asin: source.asin || null,
      is_published: false, // 下書きで作成（公開は編集画面で）
      amazon_url: source.links.amazon,
      rakuten_url: source.links.rakuten,
      yahoo_url: source.links.yahoo,
      aliexpress_url: source.links.aliexpress,
    })
    .select('id')
    .single();
  if (error) throw error;
  const newId = (data as { id: number } | null)?.id ?? null;
  // 元商品のすぐ近く（同じ日付グループの末尾）に配置
  if (newId != null && source.date) {
    await placeItemByDate(newId, source.date).catch(() => {});
  }
  return newId;
}

/** 商品ごとの累計クリック数（モール別・計測開始から全期間の合計）。管理画面のリスト表示用 */
export async function fetchTodayClicksByItem(): Promise<Map<number, Record<string, number>>> {
  const map = new Map<number, Record<string, number>>();
  if (!supabase) return map;
  // clicksは件数が増えるとPostgRESTの1回あたり取得上限(max-rows)で打ち切られ、
  // 「古いクリックだけ集計され、最近登録した商品が0件に見える」現象が起きる。
  // そこで範囲指定(range)で分割取得し、空ページが返るまで回して全件を集計する。
  const PAGE = 1000;
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('clicks')
      .select('item_id,store')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    (data as { item_id: number | null; store: string }[]).forEach((r) => {
      if (r.item_id == null) return;
      const rec = map.get(r.item_id) ?? {};
      rec[r.store] = (rec[r.store] ?? 0) + 1;
      map.set(r.item_id, rec);
    });
    from += data.length;
    if (from > 1_000_000) break; // 安全弁（無限ループ防止）
  }
  return map;
}

/**
 * 画像を配信用に自動最適化（幅720px・WebP・品質82%）。
 * 一覧グリッドでの表示サイズ（125〜200px）に対して十分な解像度を保ちつつ、
 * 転送量を1/5〜1/10に抑える。変換に失敗した場合や逆に大きくなる場合は元ファイルのまま。
 */
async function optimizeImage(file: File): Promise<{ blob: Blob; ext: string }> {
  try {
    const bmp = await createImageBitmap(file);
    const targetW = Math.min(720, bmp.width);
    const scale = targetW / bmp.width;
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return { blob: file, ext: file.name.split('.').pop() || 'jpg' };
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const webp = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
    if (webp && webp.size < file.size) return { blob: webp, ext: 'webp' };
    return { blob: file, ext: file.name.split('.').pop() || 'jpg' };
  } catch {
    return { blob: file, ext: file.name.split('.').pop() || 'jpg' };
  }
}

/** 商品画像を自動最適化してStorageにアップロードし、公開URLを返す */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase未設定');
  const { blob, ext } = await optimizeImage(file);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('item-images').upload(path, blob, {
    cacheControl: '31536000', // ファイル名がユニークなので1年キャッシュでOK（転送量削減）
    upsert: false,
    contentType: ext === 'webp' ? 'image/webp' : file.type || 'image/jpeg',
  });
  if (error) throw error;
  const { data } = supabase.storage.from('item-images').getPublicUrl(path);
  return toCdnUrl(data.publicUrl);
}
