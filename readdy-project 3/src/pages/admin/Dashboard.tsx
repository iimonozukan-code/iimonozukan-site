import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchAllItems, type Item } from '@/lib/db';

const STORES = [
  { key: 'amazon', label: 'Amazon', color: '#ff9900' },
  { key: 'rakuten', label: '楽天', color: '#bf0000' },
  { key: 'yahoo', label: 'Yahoo', color: '#ff0033' },
  { key: 'aliexpress', label: 'AliExpress', color: '#ff4747' },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [byStore, setByStore] = useState<Record<string, number>>({});
  const [topItems, setTopItems] = useState<{ name: string; clicks: number }[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (!supabase) { setLoading(false); return; }
      const items = await fetchAllItems().catch(() => [] as Item[]);
      setPublishedCount(items.filter((i) => i.isPublished).length);
      const nameById = new Map<number, string>();
      items.forEach((i) => { if (i.id != null) nameById.set(i.id, i.name); });

      const { count: totalCount } = await supabase.from('clicks').select('*', { count: 'exact', head: true });
      setTotal(totalCount ?? 0);

      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('clicks').select('*', { count: 'exact', head: true }).gte('created_at', start.toISOString());
      setToday(todayCount ?? 0);

      const { data: recent } = await supabase
        .from('clicks').select('item_id,store').order('created_at', { ascending: false }).limit(5000);
      const s: Record<string, number> = {};
      const it: Record<number, number> = {};
      (recent ?? []).forEach((r: { item_id: number | null; store: string }) => {
        s[r.store] = (s[r.store] ?? 0) + 1;
        if (r.item_id != null) it[r.item_id] = (it[r.item_id] ?? 0) + 1;
      });
      setByStore(s);
      setTopItems(
        Object.entries(it)
          .map(([id, clicks]) => ({ name: nameById.get(Number(id)) ?? `#${id}`, clicks }))
          .sort((a, b) => b.clicks - a.clicks).slice(0, 5),
      );
      setLoading(false);
    })();
  }, []);

  const maxStore = Math.max(1, ...Object.values(byStore));

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4">
        <h2 className="text-base font-semibold text-foreground-950">ダッシュボード</h2>
        <p className="text-xs text-foreground-500">クリック計測の概要</p>
      </header>
      <div className="p-4 md:p-7 max-w-4xl">
        {loading ? (
          <p className="text-sm text-foreground-500">読み込み中…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Stat label="総クリック数" value={total.toLocaleString()} />
              <Stat label="今日のクリック" value={today.toLocaleString()} />
              <Stat label="公開アイテム" value={publishedCount.toLocaleString()} />
            </div>

            <Card title="モール別クリック（直近）">
              <div className="space-y-3">
                {STORES.map((st) => (
                  <div key={st.key} className="grid grid-cols-[88px_1fr_56px] items-center gap-3 text-sm">
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded text-center" style={{ background: st.color }}>{st.label}</span>
                    <div className="h-3.5 rounded bg-background-200 overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${((byStore[st.key] ?? 0) / maxStore) * 100}%`, background: st.color }} />
                    </div>
                    <span className="text-right font-bold tabular-nums">{(byStore[st.key] ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="クリックの多い商品 TOP5">
              {topItems.length === 0 ? (
                <p className="text-sm text-foreground-400">まだクリックがありません。</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {topItems.map((t, i) => (
                      <tr key={i} className="border-b border-background-100 last:border-0">
                        <td className="py-2 text-foreground-400 w-6">{i + 1}</td>
                        <td className="py-2 font-medium">{t.name}</td>
                        <td className="py-2 text-right font-bold tabular-nums">{t.clicks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-background-200 p-4">
      <div className="text-xs text-foreground-500 font-semibold mb-1.5">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-background-200 mb-5">
      <h3 className="text-sm font-semibold px-4 py-3 border-b border-background-100">{title}</h3>
      <div className="p-4">{children}</div>
    </div>
  );
}
