import { supabase, isSupabaseConfigured } from './supabaseClient';
import { products as mockProducts, type Product } from '@/mocks/products';

export type Item = Product & {
  id?: number;
  isPublished?: boolean;
  sortOrder?: number;
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
 * 商品を「紹介日の新しい順」の正しい位置に自動配置する。
 * 「対象の日付以上の商品のうち最後のものの直後」に挿入するため、
 * 並びに多少の乱れがあっても正しいグループ位置に入る（同日グループの末尾）。
 */
export async function placeItemByDate(id: number, date: string): Promise<void> {
  if (!supabase || !date) return;
  const items = await fetchAllItems();
  const target = items.find((i) => i.id === id);
  if (!target) return;

  const rest = items.filter((i) => i.id !== id);
  let lastGE = -1;
  rest.forEach((it, k) => {
    if ((it.date || '0000-00-00') >= date) lastGE = k;
  });
  rest.splice(lastGE + 1, 0, { ...target, date });

  const updates: { id: number; sortOrder: number }[] = [];
  rest.forEach((it, k) => {
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

/** 商品ごとの本日クリック数（モール別）。管理画面のリスト表示用 */
export async function fetchTodayClicksByItem(): Promise<Map<number, Record<string, number>>> {
  const map = new Map<number, Record<string, number>>();
  if (!supabase) return map;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from('clicks')
    .select('item_id,store')
    .gte('created_at', start.toISOString())
    .limit(20000);
  if (error || !data) return map;
  (data as { item_id: number | null; store: string }[]).forEach((r) => {
    if (r.item_id == null) return;
    const rec = map.get(r.item_id) ?? {};
    rec[r.store] = (rec[r.store] ?? 0) + 1;
    map.set(r.item_id, rec);
  });
  return map;
}

/** 商品画像をStorageにアップロードして公開URLを返す */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase未設定');
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('item-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('item-images').getPublicUrl(path);
  return data.publicUrl;
}
