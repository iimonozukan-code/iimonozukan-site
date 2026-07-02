import { supabase } from './supabaseClient';

// ============================================================
// 分析ダッシュボード用：Supabase集計RPCの呼び出し
// ============================================================

export type DailyRow = { day: string; pv: number; sessions: number; clicks: number; avg_dwell: number };
export type SourceDailyRow = { day: string; source: string; pv: number };
export type SourceSummaryRow = { source: string; pv: number; sessions: number; clicks: number };
export type ItemStatRow = { item_id: number; name: string; image_url: string | null; impressions: number; clicks: number };
export type HeatRow = { dow: number; hour: number; pv: number; clicks: number };
export type StoreDailyRow = { day: string; store: string; clicks: number };
export type DwellDistRow = { bucket: string; sessions: number };
export type EngagementRow = { kind: 'click' | 'view'; n: number; sessions: number };

export type AnalyticsData = {
  daily: DailyRow[];
  sourcesDaily: SourceDailyRow[];
  sourcesSummary: SourceSummaryRow[];
  items: ItemStatRow[];
  heatmap: HeatRow[];
  storesDaily: StoreDailyRow[];
  dwellDist: DwellDistRow[];
  engagement: EngagementRow[];
};

async function rpc<T>(fn: string, days: number): Promise<T[]> {
  if (!supabase) throw new Error('Supabase未設定');
  const { data, error } = await supabase.rpc(fn, { p_days: days });
  if (error) throw new Error(`${fn}: ${error.message}`);
  return (data ?? []) as T[];
}

/** 数値カラムを安全にnumber化（numeric型が文字列で返る環境への保険） */
function nums<T extends Record<string, unknown>>(rows: T[], keys: string[]): T[] {
  return rows.map((r) => {
    const o: Record<string, unknown> = { ...r };
    keys.forEach((k) => { o[k] = Number(o[k] ?? 0); });
    return o as T;
  });
}

/** 全分析データを並列取得 */
export async function fetchAnalytics(days: number): Promise<AnalyticsData> {
  const [daily, sourcesDaily, sourcesSummary, items, heatmap, storesDaily, dwellDist, engagement] = await Promise.all([
    rpc<DailyRow>('analytics_daily', days),
    rpc<SourceDailyRow>('analytics_sources_daily', days),
    rpc<SourceSummaryRow>('analytics_sources_summary', days),
    rpc<ItemStatRow>('analytics_items', days),
    rpc<HeatRow>('analytics_heatmap', days),
    rpc<StoreDailyRow>('analytics_stores_daily', days),
    rpc<DwellDistRow>('analytics_dwell_dist', days),
    rpc<EngagementRow>('analytics_engagement', days),
  ]);
  return {
    daily: nums(daily, ['pv', 'sessions', 'clicks', 'avg_dwell']),
    sourcesDaily: nums(sourcesDaily, ['pv']),
    sourcesSummary: nums(sourcesSummary, ['pv', 'sessions', 'clicks']),
    items: nums(items, ['impressions', 'clicks']),
    heatmap: nums(heatmap, ['dow', 'hour', 'pv', 'clicks']),
    storesDaily: nums(storesDaily, ['clicks']),
    dwellDist: nums(dwellDist, ['sessions']),
    engagement: nums(engagement, ['n', 'sessions']),
  };
}

// ---------- 表示用ユーティリティ ----------

/** 秒 → 「1分23秒」/「45秒」 */
export function fmtDwell(sec: number): string {
  if (!sec || sec <= 0) return '0秒';
  const s = Math.round(sec);
  if (s < 60) return `${s}秒`;
  return `${Math.floor(s / 60)}分${s % 60 > 0 ? `${s % 60}秒` : ''}`;
}

/** CTR（0〜1ではなく%値を返す） */
export function ctr(clicks: number, views: number): number {
  if (!views) return 0;
  return (clicks / views) * 100;
}

export function fmtPct(v: number): string {
  return `${v.toFixed(1)}%`;
}

/** 'YYYY-MM-DD' → 'M/D' */
export function fmtDay(day: string): string {
  const [, m, d] = day.split('-');
  return `${parseInt(m, 10)}/${parseInt(d, 10)}`;
}

/** 移動平均（window日） */
export function movingAvg(values: number[], window = 7): number[] {
  return values.map((_, i) => {
    const from = Math.max(0, i - window + 1);
    const slice = values.slice(from, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}
