import { useEffect, useMemo, useState } from 'react';
import { fetchAnalytics, ctr, fmtPct, type AnalyticsData, fetchItemDaily, type ItemDailyRow } from '@/lib/analytics';
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

/** 計測開始日からの日次推移を、毎日の数値ラベル付き縦棒グラフで描画 */
function DailyBarChart({ title, unit, rows, valueOf, fmt, color, pinDay }: {
  title: string; unit?: string; rows: ItemDailyRow[];
  valueOf: (r: ItemDailyRow) => number; fmt: (v: number) => string;
  color: string; pinDay: string | null;
}) {
  const n = rows.length;
  const vals = rows.map(valueOf);
  const max = Math.max(1, ...vals);
  const W = 920, H = 152, padL = 6, padR = 6, padT = 22, padB = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const bw = n > 0 ? plotW / n : plotW;
  const barW = Math.max(3, bw * 0.6);
  const baseY = padT + plotH;
  const showVals = n <= 45;
  const k = Math.max(1, Math.ceil(n / 14));
  return (
    <div>
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span className="text-[11px] font-bold text-foreground-600">{title}</span>
        {unit && <span className="text-[9px] text-foreground-400">{unit}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        <line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke="#E5E7EB" strokeWidth="1" />
        {rows.map((r, i) => {
          const v = valueOf(r);
          const h = (v / max) * plotH;
          const x = padL + i * bw + (bw - barW) / 2;
          const y = baseY - h;
          const isPin = !!pinDay && r.day === pinDay;
          const parts = r.day.split('-');
          const mmdd = `${parts[1]}/${parts[2]}`;
          return (
            <g key={r.day}>
              {v > 0
                ? <rect x={x} y={y} width={barW} height={h} rx="1.5" fill={color} />
                : <rect x={x} y={baseY - 2} width={barW} height={2} rx="1" fill="#E5E7EB" />}
              {showVals && v > 0 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="8.5" fill="#4B5563">{fmt(v)}</text>
              )}
              {(i % k === 0 || i === n - 1) && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="8" fill="#9CA3AF">{mmdd}</text>
              )}
              {isPin && (
                <g>
                  <line x1={x + barW / 2} y1={padT - 7} x2={x + barW / 2} y2={baseY} stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="2 2" />
                  <text x={x + barW / 2} y={padT - 9} textAnchor="middle" fontSize="10">📌</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function OwnProducts() {
  const [days, setDays] = useState<number>(30);
  const [items, setItems] = useState<Item[]>([]);
  const [mallClicks, setMallClicks] = useState<Map<number, Record<string, number>>>(new Map());
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dailyById, setDailyById] = useState<Map<number, ItemDailyRow[]>>(new Map());
  const [loading, setLoading] = useState(true);

  // 商品・モール別クリック（期間に依存しない）→ 初回のみ取得
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetchAllItems().catch(() => [] as Item[]),
      fetchTodayClicksByItem().catch(() => new Map<number, Record<string, number>>()),
    ]).then(([its, mc]) => {
      if (!alive) return;
      setItems(its);
      setMallClicks(mc);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  // KPIカード用の集計（期間で変わる）
  useEffect(() => {
    let alive = true;
    fetchAnalytics(days).then((d) => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, [days]);

  // 自社商品ごとの日次推移（計測開始日〜・期間に依存しない）
  useEffect(() => {
    let alive = true;
    const own = items.filter((i) => i.isOwn && i.id != null);
    if (own.length === 0) { setDailyById(new Map()); return; }
    Promise.all(own.map(async (it) =>
      [it.id as number, await fetchItemDaily(it.id as number).catch(() => [] as ItemDailyRow[])] as const,
    )).then((entries) => { if (alive) setDailyById(new Map(entries)); });
    return () => { alive = false; };
  }, [items]);

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
          <p className="text-xs text-foreground-500">saunas等の自社商品だけを詳細分析（期間ボタンは上部KPI／日次グラフは計測開始日〜全期間）</p>
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
            const daily = (it.id != null ? dailyById.get(it.id) : undefined) ?? [];
            const pinDay = it.pinnedAt ? new Date(it.pinnedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' }) : null;
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
                  <Kpi label={`IMP（${days}日）`} value={imp.toLocaleString()} />
                  <Kpi label={`クリック（${days}日）`} value={clk.toLocaleString()} />
                  <Kpi label="CTR" value={fmtPct(c)} hint={vsAvg > 0 ? `サイト平均の${vsAvg.toFixed(1)}倍` : 'クリック÷IMP'} />
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

                <div className="px-4 py-3 border-t border-background-100">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                    <p className="text-[11px] font-bold text-foreground-400">日次推移（計測開始日〜・毎日のIMP／クリック／CTR）</p>
                    {pinDay && <span className="text-[10px] text-amber-600 font-bold">📌 = ピン留め日（{pinDay.slice(5).replace('-', '/')}）</span>}
                  </div>
                  {daily.length === 0 ? (
                    <p className="text-xs text-foreground-400">日次データを集計中…</p>
                  ) : (
                    <div className="space-y-4">
                      <DailyBarChart title="IMP" unit="（カードが画面に映った回数）" rows={daily} valueOf={(r) => r.imp} fmt={(v) => v.toLocaleString()} color="#8B5CF6" pinDay={pinDay} />
                      <DailyBarChart title="クリック" unit="（モール遷移数）" rows={daily} valueOf={(r) => r.clicks} fmt={(v) => String(v)} color="#F59E0B" pinDay={pinDay} />
                      <DailyBarChart title="CTR" unit="（クリック÷IMP・%）" rows={daily} valueOf={(r) => (r.imp > 0 ? (r.clicks / r.imp) * 100 : 0)} fmt={(v) => v.toFixed(1)} color="#10B981" pinDay={pinDay} />
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
