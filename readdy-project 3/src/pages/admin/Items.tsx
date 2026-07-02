import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchAllItems, fetchTodayClicksByItem, setPublished, deleteItem, updateSortOrders, type Item } from '@/lib/db';

const CAT_EMOJI: Record<string, string> = { '機械もの': '🔌', '生活もの': '🪑', '家電もの': '📺', '身装もの': '💼', '情報もの': '📱' };
const fmtDate = (d?: string) => (d ? d.replace(/-/g, '/') : '');

const MALL_META: { key: 'amazon' | 'rakuten' | 'yahoo' | 'aliexpress'; label: string; color: string }[] = [
  { key: 'amazon', label: 'Amazon', color: '#ff9900' },
  { key: 'rakuten', label: '楽天', color: '#bf0000' },
  { key: 'yahoo', label: 'Yahoo', color: '#ff0033' },
  { key: 'aliexpress', label: 'アリエク', color: '#ff4747' },
];

type SortMode = 'manual' | 'newest' | 'oldest';

function SortableRow({ it, disabled, flash, todayClicks, onToggle, onDelete }: {
  it: Item; disabled: boolean; flash: boolean;
  todayClicks?: Record<string, number>;
  onToggle: (it: Item) => void; onDelete: (it: Item) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: it.id!, disabled });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    position: isDragging ? 'relative' : undefined,
  };
  const activeMalls = MALL_META.filter((m) => it.links[m.key]);
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-item-id={it.id}
      className={`flex items-center gap-2 sm:gap-3 border-b border-background-100 last:border-0 px-2 sm:px-4 py-2.5 transition-colors duration-700 ${
        flash ? 'bg-primary-50' : 'bg-white'
      } ${isDragging ? 'shadow-lg ring-1 ring-primary-200 rounded-lg' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="ドラッグして並べ替え"
        title={disabled ? '検索中・日付順では並べ替えできません' : 'ドラッグで並べ替え'}
        className={`shrink-0 px-1.5 py-2 -ml-1 text-foreground-300 touch-none ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:text-foreground-600'}`}
      >
        <i className="ri-menu-line text-lg" />
      </button>

      <div className="w-10 h-10 rounded-lg bg-background-100 flex items-center justify-center overflow-hidden shrink-0">
        {it.image ? <img src={it.image} alt="" className="w-full h-full object-contain" /> : <span>{CAT_EMOJI[it.category] ?? '📦'}</span>}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap min-w-0">
          <span className="font-medium text-sm truncate">{it.name}</span>
          {activeMalls.length > 0 && (
            <span className="flex items-center gap-1 shrink-0">
              {activeMalls.map((m) => {
                const n = todayClicks?.[m.key] ?? 0;
                return (
                  <span
                    key={m.key}
                    title={`${m.label}：本日 ${n} クリック`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-white pl-1.5 pr-1 py-[1px] rounded"
                    style={{ background: m.color }}
                  >
                    {m.label}
                    <span className={`tabular-nums rounded px-1 ${n > 0 ? 'bg-white/25' : 'opacity-50'}`}>{n}</span>
                  </span>
                );
              })}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-foreground-500">
          <span className="whitespace-nowrap">{CAT_EMOJI[it.category]} {it.category}</span>
          <span className="whitespace-nowrap font-medium text-foreground-600">📅 {it.date ? fmtDate(it.date) : '日付なし'}</span>
          <span className={`font-bold px-1.5 py-0.5 rounded ${it.isPublished ? 'bg-primary-50 text-primary-700' : 'bg-background-200 text-foreground-500'}`}>
            {it.isPublished ? '公開中' : '下書き'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onToggle(it)} className="text-[11px] font-semibold border border-background-300 rounded-md px-2 py-1 hover:bg-background-100 whitespace-nowrap">{it.isPublished ? '非公開' : '公開'}</button>
        <Link to={`/admin/items/${it.id}`} className="text-[11px] font-semibold border border-background-300 rounded-md px-2 py-1 hover:bg-background-100">編集</Link>
        <Link
          to="/admin/items/new"
          state={{ copyFrom: it }}
          title="この商品をコピーして新規入稿（再紹介に便利）"
          className="text-[11px] font-semibold border border-background-300 rounded-md px-2 py-1 hover:bg-background-100"
        >
          複製
        </Link>
        <button onClick={() => onDelete(it)} className="text-[11px] font-semibold text-primary-600 border border-background-300 rounded-md px-2 py-1 hover:bg-primary-50">削除</button>
      </div>
    </div>
  );
}

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [todayClicks, setTodayClicks] = useState<Map<number, Record<string, number>>>(new Map());
  const [q, setQ] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('manual');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flashId, setFlashId] = useState<number | null>(null);

  const location = useLocation();
  const focusId = (location.state as { focusId?: number } | null)?.focusId ?? null;

  const load = async () => {
    setLoading(true);
    const [list, clicks] = await Promise.all([
      fetchAllItems().catch(() => [] as Item[]),
      fetchTodayClicksByItem().catch(() => new Map<number, Record<string, number>>()),
    ]);
    setItems(list);
    setTodayClicks(clicks);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // 編集・保存から戻ってきたら、その商品の位置までスクロールして一瞬ハイライト
  useEffect(() => {
    if (loading || focusId == null) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector(`[data-item-id="${focusId}"]`)?.scrollIntoView({ block: 'center' });
      });
    });
    setFlashId(focusId);
    const t = window.setTimeout(() => setFlashId(null), 2000);
    window.history.replaceState({}, ''); // リロード時に再スクロールしないよう消す
    return () => window.clearTimeout(t);
  }, [loading, focusId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isFiltered = q.trim() !== '';
  // ドラッグ並べ替えは「手動モード かつ 検索していない」ときだけ有効
  const dragDisabled = isFiltered || sortMode !== 'manual';

  const filtered = items.filter((i) => i.name.includes(q));
  // 日付順のときは紹介日でソート（日付なしは末尾）。手動のときは保存済みの並び順のまま。
  const displayed = sortMode === 'manual'
    ? filtered
    : [...filtered].sort((a, b) => {
        const da = a.date || '';
        const db = b.date || '';
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return sortMode === 'newest' ? db.localeCompare(da) : da.localeCompare(db);
      });

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
    if (dragDisabled) return;
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

  const SORT_TABS: { key: SortMode; label: string }[] = [
    { key: 'manual', label: '手動（ドラッグ）' },
    { key: 'newest', label: '新しい順' },
    { key: 'oldest', label: '古い順' },
  ];

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground-950">商品入稿・管理</h2>
          <p className="text-xs text-foreground-500 hidden sm:block">画像・リンクの入稿とアイテム管理（モール横の数字＝本日のクリック）</p>
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

        <div className="flex items-center gap-1.5 mb-3 text-xs flex-wrap">
          <span className="text-foreground-400 mr-0.5">並び替え:</span>
          {SORT_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setSortMode(t.key)}
              className={`px-2.5 py-1 rounded-md border font-semibold whitespace-nowrap ${sortMode === t.key ? 'bg-primary-500 text-white border-primary-500' : 'border-background-300 text-foreground-600 hover:bg-background-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[11px] text-foreground-400">
            {isFiltered
              ? '🔍 検索中は並べ替えできません'
              : sortMode !== 'manual'
                ? '📅 紹介日順で表示中（「手動」に戻すとドラッグで並べ替え）'
                : '☰ ドラッグで微調整OK／保存時は紹介日順に自動配置されます'}
          </p>
          {saving && <span className="text-[11px] text-primary-600">保存中…</span>}
        </div>

        <div className="bg-white rounded-xl border border-background-200 overflow-hidden">
          {loading ? (
            <p className="px-4 py-6 text-sm text-foreground-400">読み込み中…</p>
          ) : displayed.length === 0 ? (
            <p className="px-4 py-6 text-sm text-foreground-400">商品がありません。「＋ 新規入稿」から追加できます。</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={displayed.map((i) => i.id!)} strategy={verticalListSortingStrategy}>
                {displayed.map((it) => (
                  <SortableRow
                    key={it.id}
                    it={it}
                    disabled={dragDisabled}
                    flash={flashId != null && it.id === flashId}
                    todayClicks={it.id != null ? todayClicks.get(it.id) : undefined}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
