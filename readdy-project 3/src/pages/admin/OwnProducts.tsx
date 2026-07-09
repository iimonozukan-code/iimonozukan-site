import { useEffect, useMemo, useState } from 'react';
import { fetchAnalytics, ctr, fmtPct, type AnalyticsData } from '@/lib/analytics';
import { fetchAllItems, fetchTodayClicksByItem, type Item } from '@/lib/db';

const PERIODS = [7, 14, 30, 90] as const;
const MALLS: { key: string; label: string; color: string }[] = [
  { key: 'amazon', label: 'Amazon', color: '#ff9900' },
  { key: 'rakuten', label: '楽天', color: '#bf0000' },
  { key: 'yahoo', label: 'Yahoo', color: '#ff0033' },
  { key: 'aliexpress', label: 'AliExpress', color: '#ff4747' },
];

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white px-3 py-2.5">
      <div className="text-[10px] text-foreground-500 font-semibold mb-0.5 leading-tight">{label}</div>
      <div className="text-lg font-bold tabular-nums leading-none">{value}</div>
      {hint && <div className="text-[9px] text-foreground-400 mt-1 leading-tight">{hint}</div>}
    </div>
  );
}

export default function OwnProducts() {
  const [days, setDays] = useState<number>(30);
  const [items, setItems] = useState<Item[]>([]);
  const [mallClicks, setMallClicks] = useState<Map<number, Record<string, number>>>(new Map());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      fetchAllItems().catch(() => [] as Item[]),
      fetchTodayClicksByItem().catch(() => new Map<number, Record<string, number>>()),
      fetchAnalytics(days).catch(() => null),
    ]).then(([its, mc, d]) => {
      if (!alive) return;
      setItems(its);
      setMallClicks(mc);
      setData(d);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [days]);

  const ownItems = useMemo(() => items.filter((i) => i.isOwn), [items]);

  const stats = useMemo(() => {
    const rows = data?.items ?? [];
    const byId = new Map(rows.map((r) => [r.item_id, r]));
    const ranked = [...rows].sort((a, b) => b.clicks - a.clicks);
    const totalImp = rows.reduce((a, b) => a + b.impressions, 0);
    const totalClk = rows.reduce((a, b) => a + b.clicks, 0);
    return { byId, ranked, siteCtr: ctr(totalClk, totalImp), totalItems: rows.length };
  }, [data]);

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-base font-semibold text-foreground-950">自社商品パフォーマンス</h2>
          <p className="text-xs text-foreground-500">saunas等の自社商品だけを詳細分析</p>
        </div>
        <div className="flex items-center gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${days === p ? 'bg-foreground-950 text-white' : 'bg-background-100 text-foreground-500 hover:bg-background-200'}`}
            >
              {p}日
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 md:p-7 max-w-4xl space-y-5">
        {loading ? (
          <p className="text-sm text-foreground-500 py-10 text-center">読み込み中…</p>
        ) : ownItems.length === 0 ? (
          <div className="rounded-xl border border-background-200 bg-white px-4 py-10 text-center text-sm text-foreground-500">
            自社商品がまだありません。商品編集画面で「🏷️ 自社商品として登録」にチェックを入れると、ここに集計が出ます。
          </div>
        ) : (
          ownItems.map((it) => {
            const st = it.id != null ? stats.byId.get(it.id) : undefined;
            const imp = st?.impressions ?? 0;
            const clk = st?.clicks ?? 0;
            const c = ctr(clk, imp);
            const rank = it.id != null ? stats.ranked.findIndex((r) => r.item_id === it.id) + 1 : 0;
            const mc = (it.id != null ? mallClicks.get(it.id) : undefined) ?? {};
            const mcTotal = MALLS.reduce((a, m) => a + (mc[m.key] ?? 0), 0);
            const vsAvg = stats.siteCtr > 0 ? c / stats.siteCtr : 0;
            return (
              <div key={it.id} className="rounded-2xl border-2 border-amber-300 bg-white overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200">
                  <div className="w-14 h-14 rounded-lg bg-white border border-amber-200 flex items-center justify-center overflow-hidden shrink-0">
                    {it.image ? <img src={it.image} alt="" className="w-full h-full object-contain" /> : <span className="text-xl">📦</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-white bg-amber-500 px-1.5 py-[1px] rounded shrink-0">自社</span>
                      <span className="font-bold text-sm truncate">{it.name}</span>
                    </div>
                    <p className="text-[11px] text-foreground-500 mt-0.5">{it.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-background-100">
                  <Kpi label={`表示回数（${days}日）`} value={imp.toLocaleString()} />
                  <Kpi label={`クリック（${days}日）`} value={clk.toLocaleString()} />
                  <Kpi label="CTR" value={fmtPct(c)} hint={vsAvg > 0 ? `サイト平均の${vsAvg.toFixed(1)}倍` : 'クリック÷表示回数'} />
                  <Kpi label="クリック順位" value={rank > 0 ? `${rank}位` : '—'} hint={`全${stats.totalItems}商品中`} />
                </div>

                <div className="px-4 py-3">
                  <p className="text-[11px] font-bold text-foreground-400 mb-2">モール別クリック（累計）</p>
                  {mcTotal === 0 ? (
                    <p className="text-xs text-foreground-400">まだクリックがありません。</p>
                  ) : (
                    <div className="space-y-1.5">
                      {MALLS.map((m) => {
                        const v = mc[m.key] ?? 0;
                        const pct = mcTotal > 0 ? (v / mcTotal) * 100 : 0;
                        return (
                          <div key={m.key} className="grid grid-cols-[70px_1fr_66px] items-center gap-2 text-xs">
                            <span className="font-bold" style={{ color: m.color }}>{m.label}</span>
                            <div className="h-[16px] bg-background-100 rounded overflow-hidden">
                              <div className="h-full rounded" style={{ width: `${pct}%`, minWidth: v > 0 ? 4 : 0, background: m.color }} />
                            </div>
                            <span className="tabular-nums text-right"><b>{v.toLocaleString()}</b><span className="text-foreground-400"> {pct.toFixed(0)}%</span></span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
