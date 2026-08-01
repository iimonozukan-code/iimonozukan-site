import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AI_TOOL_SEED, type AiTool, type AiToolStatus, type LocalizedText } from '@/data/aiTools';

/**
 * AIツール図鑑のデータ層。
 * Supabaseの `ai_tools` テーブルを正本とし、テーブルが未作成／空のときは
 * `src/data/aiTools.ts` のシードにフォールバックする（＝移行前でも画面が壊れない）。
 */

type AiToolRow = {
  id: number;
  name: string;
  company: string | null;
  icon: string | null;
  accent_color: string | null;
  bg_from: string | null;
  bg_to: string | null;
  image_url: string | null;
  tagline_ja: string | null;
  tagline_en: string | null;
  description_ja: string | null;
  description_en: string | null;
  categories_ja: string[] | null;
  categories_en: string[] | null;
  pricing_ja: string | null;
  pricing_en: string | null;
  referral_url: string | null;
  referral_code: string | null;
  referral_label_ja: string | null;
  referral_label_en: string | null;
  benefit_ja: string | null;
  benefit_en: string | null;
  disclosure_ja: string | null;
  disclosure_en: string | null;
  cta_ja: string | null;
  cta_en: string | null;
  short_cta_ja: string | null;
  short_cta_en: string | null;
  checked_at: string | null;
  status: AiToolStatus | null;
  sort_order: number | null;
  is_published: boolean | null;
};

/** 英語が未入力なら日本語をそのまま出す（英語表示でも空欄にならないように） */
function loc(ja: string | null | undefined, en: string | null | undefined): LocalizedText {
  const jaText = (ja ?? '').trim();
  const enText = (en ?? '').trim();
  return { ja: jaText, en: enText || jaText };
}

function rowToTool(r: AiToolRow): AiTool {
  const cats = r.categories_ja ?? [];
  const catsEn = r.categories_en && r.categories_en.length > 0 ? r.categories_en : cats;
  return {
    id: r.id,
    name: r.name,
    company: r.company ?? '',
    icon: r.icon || 'ri-sparkling-line',
    accentColor: r.accent_color || '#1578d3',
    bgFrom: r.bg_from || '#f4f6f8',
    bgTo: r.bg_to || '#e6ebf0',
    imageUrl: r.image_url,
    tagline: loc(r.tagline_ja, r.tagline_en),
    description: loc(r.description_ja, r.description_en),
    categories: { ja: cats, en: catsEn },
    pricingLabel: loc(r.pricing_ja, r.pricing_en),
    referral: {
      url: r.referral_url ?? '',
      code: r.referral_code || null,
      label: loc(r.referral_label_ja, r.referral_label_en),
      benefit: loc(r.benefit_ja, r.benefit_en),
      disclosure: loc(r.disclosure_ja, r.disclosure_en),
      ctaLabel: loc(r.cta_ja, r.cta_en),
      shortCtaLabel: loc(r.short_cta_ja, r.short_cta_en),
      checkedAt: r.checked_at ?? '',
      status: r.status ?? 'active',
    },
    sortOrder: r.sort_order ?? 0,
    isPublished: r.is_published ?? false,
  };
}

export type AiToolInput = {
  name: string;
  company: string;
  icon: string;
  accentColor: string;
  bgFrom: string;
  bgTo: string;
  imageUrl: string | null;
  taglineJa: string;
  taglineEn: string;
  descriptionJa: string;
  descriptionEn: string;
  categoriesJa: string[];
  categoriesEn: string[];
  pricingJa: string;
  pricingEn: string;
  referralUrl: string;
  referralCode: string;
  referralLabelJa: string;
  referralLabelEn: string;
  benefitJa: string;
  benefitEn: string;
  disclosureJa: string;
  disclosureEn: string;
  ctaJa: string;
  ctaEn: string;
  shortCtaJa: string;
  shortCtaEn: string;
  checkedAt: string;
  status: AiToolStatus;
  isPublished: boolean;
};

function inputToRow(input: AiToolInput) {
  return {
    name: input.name,
    company: input.company || null,
    icon: input.icon || null,
    accent_color: input.accentColor || null,
    bg_from: input.bgFrom || null,
    bg_to: input.bgTo || null,
    image_url: input.imageUrl || null,
    tagline_ja: input.taglineJa || null,
    tagline_en: input.taglineEn || null,
    description_ja: input.descriptionJa || null,
    description_en: input.descriptionEn || null,
    categories_ja: input.categoriesJa,
    categories_en: input.categoriesEn,
    pricing_ja: input.pricingJa || null,
    pricing_en: input.pricingEn || null,
    referral_url: input.referralUrl || null,
    referral_code: input.referralCode || null,
    referral_label_ja: input.referralLabelJa || null,
    referral_label_en: input.referralLabelEn || null,
    benefit_ja: input.benefitJa || null,
    benefit_en: input.benefitEn || null,
    disclosure_ja: input.disclosureJa || null,
    disclosure_en: input.disclosureEn || null,
    cta_ja: input.ctaJa || null,
    cta_en: input.ctaEn || null,
    short_cta_ja: input.shortCtaJa || null,
    short_cta_en: input.shortCtaEn || null,
    checked_at: input.checkedAt || null,
    status: input.status,
    is_published: input.isPublished,
  };
}

export function toolToInput(tool: AiTool): AiToolInput {
  return {
    name: tool.name,
    company: tool.company,
    icon: tool.icon,
    accentColor: tool.accentColor,
    bgFrom: tool.bgFrom,
    bgTo: tool.bgTo,
    imageUrl: tool.imageUrl,
    taglineJa: tool.tagline.ja,
    taglineEn: tool.tagline.en === tool.tagline.ja ? '' : tool.tagline.en,
    descriptionJa: tool.description.ja,
    descriptionEn: tool.description.en === tool.description.ja ? '' : tool.description.en,
    categoriesJa: tool.categories.ja,
    categoriesEn: tool.categories.en,
    pricingJa: tool.pricingLabel.ja,
    pricingEn: tool.pricingLabel.en === tool.pricingLabel.ja ? '' : tool.pricingLabel.en,
    referralUrl: tool.referral.url,
    referralCode: tool.referral.code ?? '',
    referralLabelJa: tool.referral.label.ja,
    referralLabelEn: tool.referral.label.en === tool.referral.label.ja ? '' : tool.referral.label.en,
    benefitJa: tool.referral.benefit.ja,
    benefitEn: tool.referral.benefit.en === tool.referral.benefit.ja ? '' : tool.referral.benefit.en,
    disclosureJa: tool.referral.disclosure.ja,
    disclosureEn:
      tool.referral.disclosure.en === tool.referral.disclosure.ja ? '' : tool.referral.disclosure.en,
    ctaJa: tool.referral.ctaLabel.ja,
    ctaEn: tool.referral.ctaLabel.en === tool.referral.ctaLabel.ja ? '' : tool.referral.ctaLabel.en,
    shortCtaJa: tool.referral.shortCtaLabel.ja,
    shortCtaEn:
      tool.referral.shortCtaLabel.en === tool.referral.shortCtaLabel.ja
        ? ''
        : tool.referral.shortCtaLabel.en,
    checkedAt: tool.referral.checkedAt,
    status: tool.referral.status,
    isPublished: tool.isPublished,
  };
}

function seedPublished(): AiTool[] {
  return AI_TOOL_SEED.filter((t) => t.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** 公開サイト用：公開中のAIツール */
export async function fetchPublishedAiTools(): Promise<AiTool[]> {
  if (!isSupabaseConfigured || !supabase) return seedPublished();
  const { data, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) {
    // テーブル未作成（移行前）でも画面を壊さない
    if (error) console.warn('[aiTools] fallback to seed:', error.message);
    return seedPublished();
  }
  return (data as AiToolRow[]).map(rowToTool);
}

/** 管理用：全件（下書き含む） */
export async function fetchAllAiTools(): Promise<AiTool[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ai_tools')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as AiToolRow[]).map(rowToTool);
}

export async function fetchAiTool(id: number): Promise<AiTool | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('ai_tools').select('*').eq('id', id).single();
  if (error) throw error;
  return data ? rowToTool(data as AiToolRow) : null;
}

export async function createAiTool(input: AiToolInput): Promise<number | null> {
  if (!supabase) throw new Error('Supabase未設定');
  const { data: last } = await supabase
    .from('ai_tools')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = ((last as { sort_order: number | null }[] | null)?.[0]?.sort_order ?? 0) + 1;
  const { data, error } = await supabase
    .from('ai_tools')
    .insert({ ...inputToRow(input), sort_order: nextOrder })
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: number } | null)?.id ?? null;
}

export async function updateAiTool(id: number, input: AiToolInput): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase
    .from('ai_tools')
    .update({ ...inputToRow(input), updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function setAiToolPublished(id: number, isPublished: boolean): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase.from('ai_tools').update({ is_published: isPublished }).eq('id', id);
  if (error) throw error;
}

export async function deleteAiTool(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  const { error } = await supabase.from('ai_tools').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAiToolSortOrders(updates: { id: number; sortOrder: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase未設定');
  await Promise.all(
    updates.map((u) => supabase!.from('ai_tools').update({ sort_order: u.sortOrder }).eq('id', u.id)),
  );
}

/** AIツールごとの累計クリック数（kind別）。管理画面の一覧に出す */
export async function fetchAiClickCounts(): Promise<Map<number, Record<string, number>>> {
  const map = new Map<number, Record<string, number>>();
  if (!supabase) return map;
  const PAGE = 1000;
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('ai_clicks')
      .select('ai_tool_id,kind')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    (data as { ai_tool_id: number | null; kind: string }[]).forEach((r) => {
      if (r.ai_tool_id == null) return;
      const rec = map.get(r.ai_tool_id) ?? {};
      rec[r.kind] = (rec[r.kind] ?? 0) + 1;
      map.set(r.ai_tool_id, rec);
    });
    from += data.length;
    if (from > 1_000_000) break;
  }
  return map;
}
