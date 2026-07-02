import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchAnalytics,
  fmtDwell,
  fmtPct,
  fmtDay,
  ctr,
  movingAvg,
  type AnalyticsData,
  type ItemStatRow,
  type EngagementRow,
} from '@/lib/analytics';

// ============================================================
// メタ情報
// ============================================================

const SOURCE_META: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  youtube: { label: 'YouTube', color: '#FF0000' },
  tiktok: { label: 'TikTok', color: '#00B8C8' },
  note: { label: 'note', color: '#41C9B4' },
  x: { label: 'X (Twitter)', color: '#404040' },
  line: { label: 'LINE', color: '#06C755' },
  direct: { label: '直接アクセス', color: '#94A3B8' },
};
const FALLBACK_COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#84CC16', '#EC4899'];

const STORE_META: Record<string, { label: string; color: string }> = {
  amazon: { label: 'Amazon', color: '#FF9900' },
  rakuten: { label: '楽天', color: '#BF0000' },
  yahoo: { label: 'Yahoo', color: '#FF0033' },
  aliexpress: { label: 'AliExpress', color: '#FF4747' },
};

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
const PERIODS = [7, 14, 30, 90];

function sourceMeta(source: string, i: number): { label: string; color: string } {
  return SOURCE_META[source] ?? { label: source, color: FALLBACK_COLORS[i % FALLBACK_COLORS.length] };
}

function niceMax(v: number): number {
  if (v <= 5) return 5;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const d = v / p;
  const m = d <= 1 ? 1 : d <= 2 ? 2 : d <= 5 ? 5 : 10;
  return m * p;
}

function fmtNum(v: number): string {
  if (v >= 10000) return `${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}k`;
  return Math.round(v).toLocaleString();
}

// ============================================================
// ダッシュボード本体
// ============================================================

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchAnalytics(days)
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch((e: Error) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [days, reloadKey]);

  const daily = useMemo(() => data?.daily ?? [], [data]);
  const labels = useMemo(() => daily.map((d) => fmtDay(d.day)), [daily]);

  // ---- KPI ----
  const kpi = useMemo(() => {
    if (daily.length === 0) return null;
    const today = daily[daily.length - 1];
    const yest = daily.length > 1 ? daily[daily.length - 2] : null;
    const totalPv = daily.reduce((a, b) => a + b.pv, 0);
    const totalClicks = daily.reduce((a, b) => a + b.clicks, 0);
    const dwellNum = daily.reduce((a, b) => a + b.avg_dwell * b.sessions, 0);
    const dwellDen = daily.reduce((a, b) => a + b.sessions, 0);
    return {
      todayPv: today.pv,
      todayClicks: today.clicks,
      todayCtr: ctr(today.clicks, today.pv),
      yestPv: yest?.pv ?? null,
      yestClicks: yest?.clicks ?? null,
      avgPv: totalPv / daily.length,
      periodCtr: ctr(totalClicks, totalPv),
      avgDwell: dwellDen > 0 ? dwellNum / dwellDen : 0,
      totalPv,
      totalClicks,
    };
  }, [daily]);

  // ---- 媒体別（日次を系列にピボット） ----
  const sourceSeries = useMemo(() => {
    if (!data) return [] as { name: string; label: string; color: string; values: number[]; total: number }[];
    const totals = new Map<string, number>();
    data.sourcesDaily.forEach((r) => totals.set(r.source, (totals.get(r.source) ?? 0) + r.pv));
    const ordered = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const top = ordered.slice(0, 7).map(([s]) => s);
    const byDay = new Map<string, Map<string, number>>();
    data.sourcesDaily.forEach((r) => {
      const key = top.includes(r.source) ? r.source : 'その他';
      if (!byDay.has(key)) byDay.set(key, new Map());
      const m = byDay.get(key)!;
      m.set(r.day, (m.get(r.day) ?? 0) + r.pv);
    });
    const keys = [...top, ...(byDay.has('その他') ? ['その他'] : [])];
    return keys.map((s, i) => {
      const m = byDay.get(s) ?? new Map<string, number>();
      const meta = s === 'その他' ? { label: 'その他', color: '#CBD5E1' } : sourceMeta(s, i);
      const values = daily.map((d) => m.get(d.day) ?? 0);
      return { name: s, label: meta.label, color: meta.color, values, total: values.reduce((a, b) => a + b, 0) };
    });
  }, [data, daily]);

  // ---- モール別 ----
  const storeSeries = useMemo(() => {
    if (!data) return [] as { label: string; color: string; values: number[]; total: number }[];
    return Object.entries(STORE_META).map(([key, meta]) => {
      const m = new Map<string, number>();
      data.storesDaily.filter((r) => r.store === key).forEach((r) => m.set(r.day, r.clicks));
      const values = daily.map((d) => m.get(d.day) ?? 0);
      return { label: meta.label, color: meta.color, values, total: values.reduce((a, b) => a + b, 0) };
    }).filter((s) => s.total > 0);
  }, [data, daily]);

  const isEmpty = kpi != null && kpi.totalPv === 0 && kpi.totalClicks === 0;

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-base font-semibold text-foreground-950">分析ダッシュボード</h2>
          <p className="text-xs text-foreground-500">アクセス・流入・CTR・滞在時間のマーケティング分析</p>
        </div>
        <div className="flex items-center gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                days === p ? 'bg-foreground-950 text-white' : 'bg-background-100 text-foreground-500 hover:bg-background-200'
              }`}
            >
              {p}日
            </button>
          ))}
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="更新"
            className="ml-1 w-8 h-8 rounded-full bg-background-100 hover:bg-background-200 text-foreground-500 flex items-center justify-center cursor-pointer"
          >
            <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="p-4 md:p-7 max-w-6xl">
        {error ? (
          <SetupCard message={error} />
        ) : loading && !data ? (
          <p className="text-sm text-foreground-500 py-10 text-center">読み込み中…</p>
        ) : data && kpi ? (
          <>
            {isEmpty && (
              <div className="mb-5 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
                ✨ 計測を開始しました。サイトにアクセスがあると、ここに数字がリアルタイムで貯まっていきます。
              </div>
            )}

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
              <Kpi label="今日のアクセス" value={fmtNum(kpi.todayPv)} delta={delta(kpi.todayPv, kpi.yestPv)} />
              <Kpi label="今日のクリック" value={fmtNum(kpi.todayClicks)} delta={delta(kpi.todayClicks, kpi.yestClicks)} />
              <Kpi label="今日のCTR" value={fmtPct(kpi.todayCtr)} hint="クリック÷アクセス" />
              <Kpi label={`日平均アクセス（${days}日）`} value={fmtNum(kpi.avgPv)} />
              <Kpi label={`期間CTR（${days}日）`} value={fmtPct(kpi.periodCtr)} />
              <Kpi label="平均滞在時間" value={fmtDwell(kpi.avgDwell)} hint="画面表示中のみ計測" />
            </div>

            {/* アクセス＆クリック推移 */}
            <Section title="アクセス＆クリック推移" sub="面＝アクセス数／橙＝クリック数／点線＝7日移動平均">
              <TrendChart
                labels={labels}
                series={[
                  { label: 'アクセス', color: '#6366F1', values: daily.map((d) => d.pv), area: true },
                  { label: '7日平均', color: '#A5B4FC', values: movingAvg(daily.map((d) => d.pv)), dashed: true },
                  { label: 'クリック', color: '#F59E0B', values: daily.map((d) => d.clicks) },
                ]}
                height={230}
              />
            </Section>

            <div className="grid md:grid-cols-2 gap-5">
              <Section title="CTR推移" sub="1日ごとの クリック数÷アクセス数">
                <TrendChart
                  labels={labels}
                  series={[{ label: 'CTR', color: '#10B981', values: daily.map((d) => ctr(d.clicks, d.pv)), area: true }]}
                  height={180}
                  fmt={(v) => `${v.toFixed(1)}%`}
                />
              </Section>
              <Section title="滞在時間の推移" sub="訪問1回あたりの平均滞在秒数">
                <TrendChart
                  labels={labels}
                  series={[{ label: '平均滞在', color: '#8B5CF6', values: daily.map((d) => d.avg_dwell), area: true }]}
                  height={180}
                  fmt={(v) => fmtDwell(v)}
                />
              </Section>
            </div>

            {/* 媒体別流入 */}
            <Section
              title="媒体別の流入推移"
              sub="Instagram・YouTube・TikTokなど、どこから人が来ているか（タップで表示切替）"
            >
              <SourcesChart labels={labels} series={sourceSeries} />
            </Section>

            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <Section title="曜日×時間ヒートマップ" sub="どの曜日・時間帯にアクセスが集中しているか（投稿時間の最適化に）">
                  <Heatmap rows={data.heatmap} />
                </Section>
              </div>
              <Section title="滞在時間の分布" sub="訪問ごとの滞在時間の内訳">
                <DwellBars rows={data.dwellDist} />
              </Section>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Section title="モール別クリック推移" sub="Amazon・楽天・Yahoo・AliExpressの日別クリック">
                {storeSeries.length === 0 ? (
                  <Empty text="まだクリックがありません。" />
                ) : (
                  <TrendChart labels={labels} series={storeSeries} height={190} />
                )}
              </Section>
              <Section title="媒体別サマリー" sub="流入元ごとのアクセス・クリック・CTR">
                <SourcesTable rows={data.sourcesSummary} />
              </Section>
            </div>

            {/* 商品回遊 */}
            <Section
              title="商品回遊（1訪問あたり何種類の商品に反応したか）"
              sub="訪問1回の中で、何種類の商品をクリック／閲覧したかの正確な分布。2種類以上＝サイト内を回遊している訪問"
            >
              <EngagementCard rows={data.engagement} />
            </Section>

            {/* 商品ランキング */}
            <Section
              title="商品パフォーマンス ランキング"
              sub="表示回数＝カードが画面に映った回数／CTR＝クリック÷表示回数。列見出しをタップで並び替え"
            >
              <ItemsTable rows={data.items} />
            </Section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function delta(now: number, prev: number | null): number | null {
  if (prev == null || prev === 0) return null;
  return ((now - prev) / prev) * 100;
}

// ============================================================
// 小物コンポーネント
// ============================================================

function Kpi({ label, value, delta: d, hint }: { label: string; value: string; delta?: number | null; hint?: string }) {
  return (
    <div className="bg-white rounded-xl border border-background-200 p-3.5">
      <div className="text-[11px] text-foreground-500 font-semibold mb-1 leading-tight">{label}</div>
      <div className="text-xl md:text-2xl font-bold tabular-nums leading-none">{value}</div>
      <div className="mt-1.5 h-4 text-[11px]">
        {d != null ? (
          <span className={`font-bold ${d >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            <i className={`ri-arrow-${d >= 0 ? 'up' : 'down'}-line`} />
            {Math.abs(d).toFixed(0)}% <span className="text-foreground-400 font-normal">昨日比</span>
          </span>
        ) : hint ? (
          <span className="text-foreground-400">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-background-200 mb-5">
      <div className="px-4 py-3 border-b border-background-100">
        <h3 className="text-sm font-semibold text-foreground-950">{title}</h3>
        {sub && <p className="text-[11px] text-foreground-400 mt-0.5">{sub}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-foreground-400 py-6 text-center">{text}</p>;
}

function SetupCard({ message }: { message: string }) {
  const needsSql = /analytics_|function|schema cache/i.test(message);
  return (
    <div className="bg-white rounded-xl border border-background-200 p-6 max-w-xl">
      <h3 className="text-sm font-bold mb-2">
        {needsSql ? '分析用のデータベース設定がまだ適用されていません' : 'データの取得に失敗しました'}
      </h3>
      {needsSql ? (
        <p className="text-sm text-foreground-500 leading-relaxed">
          Supabaseの <b>SQL Editor</b> で <code className="bg-background-100 px-1 rounded">analytics_migration.sql</code>{' '}
          を実行すると、このダッシュボードが使えるようになります。
        </p>
      ) : null}
      <p className="text-xs text-foreground-400 mt-3 break-all">{message}</p>
    </div>
  );
}

// ============================================================
// 汎用トレンドチャート（SVG・ホバー付き）
// ============================================================

type Series = { label: string; color: string; values: number[]; dashed?: boolean; area?: boolean };

function TrendChart({
  labels,
  series,
  height = 200,
  fmt = fmtNum,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  fmt?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const W = 720;
  const H = height;
  const pad = { l: 40, r: 10, t: 12, b: 22 };
  const n = labels.length;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const rawMax = Math.max(1, ...series.flatMap((s) => s.values));
  const max = niceMax(rawMax);
  const x = (i: number) => pad.l + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;

  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const areaPath = (vals: number[]) =>
    `${path(vals)} L${x(n - 1).toFixed(1)},${(pad.t + innerH).toFixed(1)} L${x(0).toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`;

  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((f) => pad.t + innerH * f);
  const xTickEvery = Math.max(1, Math.ceil(n / 7));
  const gid = useMemo(() => `g${Math.random().toString(36).slice(2, 8)}`, []);

  const locate = (clientX: number) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const px = ((clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((px - pad.l) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  };

  return (
    <div ref={boxRef} className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        onMouseMove={(e) => locate(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => locate(e.touches[0].clientX)}
        onTouchMove={(e) => locate(e.touches[0].clientX)}
      >
        <defs>
          {series.map((s, si) =>
            s.area ? (
              <linearGradient key={si} id={`${gid}-${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
              </linearGradient>
            ) : null,
          )}
        </defs>

        {gridYs.map((gy, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={gy} y2={gy} stroke="#E9E9EE" strokeWidth="1" />
            <text x={pad.l - 6} y={gy + 3.5} fontSize="10" fill="#9CA3AF" textAnchor="end">
              {fmt(max * (1 - [0, 0.25, 0.5, 0.75, 1][i]))}
            </text>
          </g>
        ))}

        {labels.map((lb, i) =>
          i % xTickEvery === 0 ? (
            <text key={i} x={x(i)} y={H - 6} fontSize="10" fill="#9CA3AF" textAnchor="middle">
              {lb}
            </text>
          ) : null,
        )}

        {series.map((s, si) => (
          <g key={si}>
            {s.area && <path d={areaPath(s.values)} fill={`url(#${gid}-${si})`} />}
            <path
              d={path(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.2"
              strokeDasharray={s.dashed ? '5 4' : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        ))}

        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + innerH} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
            {series.filter((s) => !s.dashed).map((s, si) => (
              <circle key={si} cx={x(hover)} cy={y(s.values[hover])} r="4" fill={s.color} stroke="#fff" strokeWidth="1.5" />
            ))}
          </g>
        )}
      </svg>

      {hover != null && (
        <div
          className="absolute top-1 pointer-events-none bg-foreground-950/90 text-white rounded-lg px-3 py-2 text-[11px] leading-relaxed shadow-lg z-10 whitespace-nowrap"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > labels.length / 2 ? 'calc(-100% - 10px)' : '10px'})`,
          }}
        >
          <div className="font-bold mb-0.5">{labels[hover]}</div>
          {series.map((s, si) => (
            <div key={si} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />
              {s.label}：<b className="tabular-nums">{fmt(s.values[hover])}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 媒体別チャート（凡例トグル付き）
// ============================================================

function SourcesChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; label: string; color: string; values: number[]; total: number }[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const visible = series.filter((s) => !hidden.has(s.name));

  if (series.length === 0) return <Empty text="まだ流入データがありません。SNSのリンクからアクセスがあると表示されます。" />;

  const toggle = (name: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {series.map((s) => {
          const off = hidden.has(s.name);
          return (
            <button
              key={s.name}
              onClick={() => toggle(s.name)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                off ? 'bg-background-100 text-foreground-300 border-background-200' : 'bg-white text-foreground-700 border-background-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: off ? '#CBD5E1' : s.color }} />
              {s.label}
              <span className="tabular-nums font-normal text-foreground-400">{s.total.toLocaleString()}</span>
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <Empty text="表示する媒体を選択してください。" />
      ) : (
        <TrendChart labels={labels} series={visible} height={210} />
      )}
    </div>
  );
}

// ============================================================
// 曜日×時間ヒートマップ
// ============================================================

function Heatmap({ rows }: { rows: { dow: number; hour: number; pv: number; clicks: number }[] }) {
  const [metric, setMetric] = useState<'pv' | 'clicks'>('pv');
  const grid = useMemo(() => {
    const g: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
    rows.forEach((r) => { g[r.dow][r.hour] = metric === 'pv' ? r.pv : r.clicks; });
    return g;
  }, [rows, metric]);
  const max = Math.max(1, ...grid.flat());
  const best = useMemo(() => {
    let b = { d: 0, h: 0, v: -1 };
    grid.forEach((row, d) => row.forEach((v, h) => { if (v > b.v) b = { d, h, v }; }));
    return b;
  }, [grid]);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        {(['pv', 'clicks'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
              metric === m ? 'bg-foreground-950 text-white' : 'bg-background-100 text-foreground-500'
            }`}
          >
            {m === 'pv' ? 'アクセス' : 'クリック'}
          </button>
        ))}
        {best.v > 0 && (
          <span className="ml-auto text-[11px] text-foreground-500">
            ピーク：<b>{DOW[best.d]}曜 {best.h}時</b>（{best.v.toLocaleString()}）
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: '20px repeat(24, 1fr)' }}>
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center text-[9px] text-foreground-400 tabular-nums">
                {h % 3 === 0 ? h : ''}
              </div>
            ))}
            {grid.map((row, d) => (
              <HeatRow key={d} d={d} row={row} max={max} metric={metric} />
            ))}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-foreground-400">
            少ない
            {[0.1, 0.3, 0.55, 0.8, 1].map((a) => (
              <span key={a} className="w-3.5 h-3.5 rounded-[3px]" style={{ background: heatColor(a) }} />
            ))}
            多い
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatRow({ d, row, max, metric }: { d: number; row: number[]; max: number; metric: string }) {
  return (
    <>
      <div className={`text-[10px] font-bold flex items-center ${d === 0 ? 'text-rose-500' : d === 6 ? 'text-blue-500' : 'text-foreground-500'}`}>
        {DOW[d]}
      </div>
      {row.map((v, h) => (
        <div
          key={h}
          title={`${DOW[d]}曜 ${h}時：${v.toLocaleString()}${metric === 'pv' ? 'アクセス' : 'クリック'}`}
          className="aspect-square rounded-[3px] min-h-[14px]"
          style={{ background: v === 0 ? '#F1F1F4' : heatColor(v / max) }}
        />
      ))}
    </>
  );
}

function heatColor(a: number): string {
  // 白→インディゴのスケール
  const t = 0.12 + a * 0.88;
  return `rgba(79, 70, 229, ${t.toFixed(2)})`;
}

// ============================================================
// 滞在時間の分布
// ============================================================

function DwellBars({ rows }: { rows: { bucket: string; sessions: number }[] }) {
  const total = rows.reduce((a, b) => a + b.sessions, 0);
  if (total === 0) return <Empty text="まだ滞在データがありません。" />;
  const max = Math.max(1, ...rows.map((r) => r.sessions));
  return (
    <div className="space-y-2.5 py-1">
      {rows.map((r) => (
        <div key={r.bucket} className="grid grid-cols-[64px_1fr_72px] items-center gap-2 text-xs">
          <span className="text-foreground-500 font-semibold">{r.bucket}</span>
          <div className="h-4 bg-background-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-violet-500"
              style={{ width: `${(r.sessions / max) * 100}%`, minWidth: r.sessions > 0 ? 4 : 0 }}
            />
          </div>
          <span className="text-right tabular-nums">
            <b>{r.sessions.toLocaleString()}</b>
            <span className="text-foreground-400">（{((r.sessions / total) * 100).toFixed(0)}%）</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 商品回遊（セッションごとのクリック/閲覧 種類数の正確な分布）
// ============================================================

function EngagementCard({ rows }: { rows: EngagementRow[] }) {
  const [kind, setKind] = useState<'click' | 'view'>('click');
  const data = useMemo(
    () => rows.filter((r) => r.kind === kind).sort((a, b) => a.n - b.n),
    [rows, kind],
  );
  const total = data.reduce((a, b) => a + b.sessions, 0);
  const multi = data.filter((r) => r.n >= 2).reduce((a, b) => a + b.sessions, 0);
  const weighted = data.reduce((a, b) => a + b.n * b.sessions, 0);
  const maxSessions = Math.max(1, ...data.map((r) => r.sessions));
  const maxN = data.length > 0 ? data[data.length - 1].n : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {(['click', 'view'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
              kind === k ? 'bg-foreground-950 text-white' : 'bg-background-100 text-foreground-500'
            }`}
          >
            {k === 'click' ? 'クリック（購入リンク）' : '閲覧（カード表示）'}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <Empty text="まだ回遊データがありません（セッション付き計測の開始後から集計されます）。" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MiniStat label={kind === 'click' ? 'クリックした訪問' : '閲覧した訪問'} value={`${total.toLocaleString()}件`} />
            <MiniStat label="2種類以上（回遊あり）" value={`${multi.toLocaleString()}件`} hint={`${((multi / total) * 100).toFixed(1)}%`} accent />
            <MiniStat label="平均種類数" value={(weighted / total).toFixed(2)} />
            <MiniStat label="最多記録" value={`${maxN}種類`} />
          </div>

          <div className="space-y-1.5">
            {data.map((r) => (
              <div key={r.n} className="grid grid-cols-[76px_1fr_120px] items-center gap-2 text-xs">
                <span className="font-bold text-foreground-600 text-right pr-1 tabular-nums">{r.n}種類</span>
                <div className="h-[18px] bg-background-100 rounded overflow-hidden">
                  <div
                    className={`h-full rounded ${r.n === 1 ? 'bg-background-300' : 'bg-sky-500'}`}
                    style={{ width: `${(r.sessions / maxSessions) * 100}%`, minWidth: 4 }}
                  />
                </div>
                <span className="tabular-nums">
                  <b>{r.sessions.toLocaleString()}</b>件
                  <span className="text-foreground-400">（{((r.sessions / total) * 100).toFixed(1)}%）</span>
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-foreground-400 mt-3">
            訪問（セッション）＝タブを開いてから閉じるまで。同じ商品の別モールクリックは1種類と数えます。グレー＝1種類のみ／青＝回遊あり。
          </p>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${accent ? 'border-sky-200 bg-sky-50' : 'border-background-200 bg-background-50'}`}>
      <div className="text-[10px] font-semibold text-foreground-500 mb-0.5">{label}</div>
      <div className="text-lg font-bold tabular-nums leading-none">
        {value}
        {hint && <span className={`ml-1.5 text-xs ${accent ? 'text-sky-600' : 'text-foreground-400'}`}>{hint}</span>}
      </div>
    </div>
  );
}

// ============================================================
// 媒体別サマリーテーブル
// ============================================================

function SourcesTable({ rows }: { rows: { source: string; pv: number; sessions: number; clicks: number }[] }) {
  if (rows.length === 0) return <Empty text="まだデータがありません。" />;
  const totalPv = rows.reduce((a, b) => a + b.pv, 0);
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-foreground-400 text-[10px] uppercase">
          <th className="text-left font-bold pb-2">媒体</th>
          <th className="text-right font-bold pb-2">アクセス</th>
          <th className="text-right font-bold pb-2">クリック</th>
          <th className="text-right font-bold pb-2">CTR</th>
        </tr>
      </thead>
      <tbody>
        {rows.slice(0, 10).map((r, i) => {
          const meta = sourceMeta(r.source, i);
          const share = totalPv > 0 ? (r.pv / totalPv) * 100 : 0;
          return (
            <tr key={r.source} className="border-t border-background-100">
              <td className="py-2 pr-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
                  <span className="font-semibold truncate max-w-[120px]">{meta.label}</span>
                </div>
                <div className="mt-1 h-1 rounded bg-background-100 overflow-hidden max-w-[140px]">
                  <div className="h-full rounded" style={{ width: `${share}%`, background: meta.color }} />
                </div>
              </td>
              <td className="py-2 text-right tabular-nums font-bold">{r.pv.toLocaleString()}</td>
              <td className="py-2 text-right tabular-nums">{r.clicks.toLocaleString()}</td>
              <td className="py-2 text-right tabular-nums font-bold">{fmtPct(ctr(r.clicks, r.pv))}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ============================================================
// 商品ランキングテーブル（ソート可能）
// ============================================================

type SortKey = 'impressions' | 'clicks' | 'ctr';

function ItemsTable({ rows }: { rows: ItemStatRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('clicks');
  const [minImp, setMinImp] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const filtered = minImp ? rows.filter((r) => r.impressions >= 20) : rows;
    const val = (r: ItemStatRow) =>
      sortKey === 'ctr' ? (r.impressions > 0 ? r.clicks / r.impressions : 0) : r[sortKey];
    return [...filtered].sort((a, b) => val(b) - val(a));
  }, [rows, sortKey, minImp]);

  if (rows.length === 0) return <Empty text="まだ商品の表示・クリックデータがありません。" />;

  const list = showAll ? sorted : sorted.slice(0, 20);

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => setSortKey(k)}
      className={`text-right font-bold px-2 py-2 cursor-pointer select-none whitespace-nowrap ${
        sortKey === k ? 'text-foreground-950' : 'text-foreground-400 hover:text-foreground-600'
      }`}
    >
      {label} {sortKey === k && <i className="ri-arrow-down-s-fill" />}
    </th>
  );

  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] text-foreground-500 mb-2 cursor-pointer w-fit">
        <input type="checkbox" checked={minImp} onChange={(e) => setMinImp(e.target.checked)} className="cursor-pointer" />
        表示回数20回以上のみ（CTRの信頼度アップ）
      </label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-[10px] uppercase border-b border-background-200">
              <th className="text-left font-bold px-2 py-2 text-foreground-400 w-8">#</th>
              <th className="text-left font-bold px-2 py-2 text-foreground-400">商品</th>
              <Th k="impressions" label="表示回数" />
              <Th k="clicks" label="クリック" />
              <Th k="ctr" label="CTR" />
            </tr>
          </thead>
          <tbody>
            {list.map((r, i) => {
              const c = ctr(r.clicks, r.impressions);
              const reliable = r.impressions >= 20;
              return (
                <tr key={r.item_id} className="border-b border-background-100 last:border-0">
                  <td className="px-2 py-2 text-foreground-400 tabular-nums">{i + 1}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {r.image_url ? (
                        <img src={r.image_url} alt="" loading="lazy" className="w-9 h-12 object-cover rounded-md bg-background-100 shrink-0" />
                      ) : (
                        <div className="w-9 h-12 rounded-md bg-background-100 shrink-0" />
                      )}
                      <span className="font-medium truncate max-w-[200px] md:max-w-[320px]">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-foreground-500">{r.impressions.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right tabular-nums font-bold">{r.clicks.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                        r.impressions === 0
                          ? 'bg-background-100 text-foreground-400'
                          : c >= 8
                            ? 'bg-emerald-50 text-emerald-600'
                            : c >= 4
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-background-100 text-foreground-500'
                      }`}
                      title={reliable ? undefined : '表示回数が少ないため参考値'}
                    >
                      {r.impressions === 0 ? '—' : `${c.toFixed(1)}%${reliable ? '' : '*'}`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length > 20 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 w-full py-2 rounded-lg bg-background-100 hover:bg-background-200 text-xs font-bold text-foreground-500 cursor-pointer"
        >
          {showAll ? '閉じる' : `すべて表示（${sorted.length}件）`}
        </button>
      )}
      <p className="text-[10px] text-foreground-400 mt-2">* は表示回数20回未満の参考値</p>
    </div>
  );
}
