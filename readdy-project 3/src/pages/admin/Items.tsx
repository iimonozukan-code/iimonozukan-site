import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchAllItems, setPublished, deleteItem, updateSortOrders, type Item } from '@/lib/db';

const CAT_EMOJI: Record<string, string> = { '機械もの': '🔌', '生活もの': '🪑', '家電もの': '📺', '身装もの': '💼', '情報もの': '📱' };
const linkCount = (it: Item) => Object.values(it.links).filter(Boolean).length;

function SortableRow({ it, disabled, onToggle, onDelete }: {
  it: Item; disabled: boolean;
  onToggle: (it: Item) => void; onDelete: (it: Item) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: it.id!, disabled });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    position: isDragging ? 'relative' : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 sm:gap-3 bg-white border-b border-background-100 last:border-0 px-2 sm:px-4 py-2.5 ${isDragging ? 'shadow-lg ring-1 ring-primary-200 rounded-lg' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="ドラッグして並べ替え"
        title={disabled ? '検索中は並べ替えできません' : 'ドラッグで並べ替え'}
        className={`shrink-0 px-1.5 py-2 -ml-1 text-foreground-300 touch-none ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:text-foreground-600'}`}
      >
        <i className="ri-menu-line text-lg" />
      </button>

      <div className="w-10 h-10 rounded-lg bg-background-100 flex items-center justify-center overflow-hidden shrink-0">
        {it.image ? <img src={it.image} alt="" className="w-full h-full object-contain" /> : <span>{CAT_EMOJI[it.category] ?? '📦'}</span>}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{it.name}</div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-foreground-500">
          <span className="whitespace-nowrap">{CAT_EMOJI[it.category]} {it.category}</span>
          <span className="whitespace-nowrap">🔗 {linkCount(it)}</span>
          <span className={`font-bold px-1.5 py-0.5 rounded ${it.isPublished ? 'bg-primary-50 text-primary-700' : 'bg-background-200 text-foreground-500'}`}>
            {it.isPublished ? '公開中' : '下書き'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onToggle(it)} className="text-[11px] font-semibold border border-background-300 rounded-md px-2 py-1 hover:bg-background-100 whitespace-nowrap">{it.isPublished ? '非公開' : '公開'}</button>
        <Link to={`/admin/items/${it.id}`} className="text-[11px] font-semibold border border-background-300 rounded-md px-2 py-1 hover:bg-background-100">編集</Link>
        <button onClick={() => onDelete(it)} className="text-[11px] font-semibold text-primary-600 border border-background-300 rounded-md px-2 py-1 hover:bg-primary-50">削除</button>
      </div>
    </div>
  );
}

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await fetchAllItems().catch(() => []));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isFiltered = q.trim() !== '';
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

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const moved = arrayMove(items, oldIndex, newIndex);
    // 並びを 0..n に正規化（変わった行だけ保存）
    const renum = moved.map((it, k) => ({ ...it, sortOrder: k }));
    const updates: { id: number; sortOrder: number }[] = [];
    moved.forEach((it, k) => { if (it.id != null && it.sortOrder !== k) updates.push({ id: it.id, sortOrder: k }); });
    setItems(renum); // 楽観更新（すぐ反映）
    if (updates.length === 0) return;
    setSaving(true);
    try { await updateSortOrders(updates); }
    catch { await load(); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground-950">商品入稿・管理</h2>
          <p className="text-xs text-foreground-500 hidden sm:block">画像・リンクの入稿とアイテム管理</p>
        </div>
        <Link to="/admin/items/new" className="bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 whitespace-nowrap shrink-0">＋ 新規入稿</Link>
      </header>

      <div className="p-4 md:p-7 max-w-4xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 商品名で検索…"
          className="w-full mb-3 px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500"
        />
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] text-foreground-400">
            {isFiltered ? '🔍 検索中は並べ替えできません' : '☰ を上下にドラッグで並べ替え（公開サイトに反映）'}
          </p>
          {saving && <span className="text-[11px] text-primary-600">保存中…</span>}
        </div>

        <div className="bg-white rounded-xl border border-background-200 overflow-hidden">
          {loading ? (
            <p className="px-4 py-6 text-sm text-foreground-400">読み込み中…</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-foreground-400">商品がありません。「＋ 新規入稿」から追加できます。</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={filtered.map((i) => i.id!)} strategy={verticalListSortingStrategy}>
                {filtered.map((it) => (
                  <SortableRow key={it.id} it={it} disabled={isFiltered} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
