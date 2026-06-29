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

export async function createItem(input: ItemInput): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase.from('items').insert(inputToRow(input));
  if (error) throw error;
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
