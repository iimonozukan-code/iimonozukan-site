import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllItems, setPublished, deleteItem, type Item } from '@/lib/db';

const CAT_EMOJI: Record<string, string> = { '機械もの': '🔌', '生活もの': '🪑', '家電もの': '📺', '身装もの': '💼', '情報もの': '📱' };

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setItems(await fetchAllItems().catch(() => []));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const linkCount = (it: Item) => Object.values(it.links).filter(Boolean).length;
  const filtered = items.filter((i) => i.name.includes(q));

  const onToggle = async (it: Item) => {
    if (it.id == null) return;
    await setPublished(it.id, !it.isPublished);
    load();
  };
  const onDelete = async (it: Item) => {
    if (it.id == null) return;
    if (!confirm(`「${it.name}」を削除しますか？`)) return;
    await deleteItem(it.id);
    load();
  };

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-7 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground-950">商品入稿・管理</h2>
          <p className="text-xs text-foreground-500">画像・リンクの入稿とアイテム管理</p>
        </div>
        <Link to="/admin/items/new" className="bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 whitespace-nowrap">＋ 新規入稿</Link>
      </header>
      <div className="p-7 max-w-4xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 商品名で検索…"
          className="w-full mb-4 px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500"
        />
        <div className="bg-white rounded-xl border border-background-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-foreground-500 text-[11px] uppercase">
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">商品</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">カテゴリ</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">リンク</th>
                <th className="text-left font-bold px-4 py-2.5 border-b border-background-200">公開</th>
                <th className="border-b border-background-200"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground-400">読み込み中…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-foreground-400">商品がありません。「＋ 新規入稿」から追加できます。</td></tr>
              ) : filtered.map((it) => (
                <tr key={it.id} className="border-b border-background-100 last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center overflow-hidden shrink-0">
                        {it.image ? <img src={it.image} alt="" className="w-full h-full object-contain" /> : <span>{CAT_EMOJI[it.category] ?? '📦'}</span>}
                      </div>
                      <span className="font-medium">{it.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{CAT_EMOJI[it.category]} {it.category}</td>
                  <td className="px-4 py-2.5 text-foreground-500">🔗 {linkCount(it)}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${it.isPublished ? 'bg-primary-50 text-primary-700' : 'bg-background-200 text-foreground-500'}`}>
                      {it.isPublished ? '公開中' : '下書き'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => onToggle(it)} className="text-xs font-semibold border border-background-300 rounded-md px-2.5 py-1 mr-1.5 hover:bg-background-100">{it.isPublished ? '非公開' : '公開'}</button>
                    <Link to={`/admin/items/${it.id}`} className="text-xs font-semibold border border-background-300 rounded-md px-2.5 py-1 mr-1.5 hover:bg-background-100">編集</Link>
                    <button onClick={() => onDelete(it)} className="text-xs font-semibold text-primary-600 border border-background-300 rounded-md px-2.5 py-1 hover:bg-primary-50">削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
