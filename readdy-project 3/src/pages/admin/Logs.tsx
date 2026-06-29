import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchAllItems } from '@/lib/db';

type Row = { id: number; item_id: number | null; store: string; referrer: string | null; device: string | null; created_at: string };

const STORE_COLOR: Record<string, string> = { amazon: '#ff9900', rakuten: '#bf0000', yahoo: '#ff0033', aliexpress: '#ff4747' };

export default function Logs() {
  const [rows, setRows] = useState<Row[]>([]);
  const [names, setNames] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) { setLoading(false); return; }
      const items = await fetchAllItems().catch(() => []);
      const m = new Map<number, string>();
      items.forEach((i) => { if (i.id != null) m.set(i.id, i.name); });
      setNames(m);
      const { data } = await supabase
        .from('clicks').select('id,item_id,store,referrer,device,created_at')
        .order('created_at', { ascending: false }).limit(200);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const fmt = (s: string) => new Date(s).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-7 py-4">
        <h2 className="text-base font-semibold text-foreground-950">クリックログ</h2>
        <p className="text-xs text-foreground-500">運営者だけが見られる生ログ（直近200件）</p>
      </header>
      <div className="p-7 max-w-4xl">
        <div className="bg-white rounded-xl border border-background-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-foreground-500 text-[11px] uppercase">
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">日時</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">商品</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">モール</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">デバイス</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">流入元</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground-400">読み込み中…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground-400">まだクリックがありません。</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-b border-background-100 last:border-0">
                  <td className="px-4 py-2.5 text-foreground-500 tabular-nums whitespace-nowrap">{fmt(r.created_at)}</td>
                  <td className="px-4 py-2.5">{r.item_id != null ? (names.get(r.item_id) ?? `#${r.item_id}`) : '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded" style={{ background: STORE_COLOR[r.store] ?? '#888' }}>{r.store}</span>
                  </td>
                  <td className="px-4 py-2.5">{r.device ?? '—'}</td>
                  <td className="px-4 py-2.5 text-foreground-500">{r.referrer ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
