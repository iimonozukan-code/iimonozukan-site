import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllAiTools,
  fetchAiClickCounts,
  setAiToolPublished,
  deleteAiTool,
  updateAiToolSortOrders,
} from '@/lib/aiTools';
import type { AiTool } from '@/data/aiTools';

const KIND_META: { key: string; label: string; color: string; hint: string }[] = [
  { key: 'referral', label: 'リンク', color: '#e11d48', hint: 'アフィリリンクのクリック' },
  { key: 'detail', label: '詳細', color: '#0284c7', hint: 'カードをタップして詳細を開いた回数' },
];

export default function AiTools() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [clicks, setClicks] = useState<Map<number, Record<string, number>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    fetchAllAiTools()
      .then((list) => {
        setTools(list);
        setError('');
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      })
      .finally(() => setLoading(false));
    fetchAiClickCounts()
      .then(setClicks)
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  const togglePublished = async (tool: AiTool) => {
    await setAiToolPublished(tool.id, !tool.isPublished);
    load();
  };

  const remove = async (tool: AiTool) => {
    if (!window.confirm(`「${tool.name}」を削除します。よろしいですか？`)) return;
    await deleteAiTool(tool.id);
    load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= tools.length) return;
    const reordered = [...tools];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(next, 0, moved);
    setTools(reordered);
    await updateAiToolSortOrders(reordered.map((t, k) => ({ id: t.id, sortOrder: k + 1 })));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">AI図鑑</h1>
          <p className="mt-0.5 text-[11px] text-foreground-500">
            公開ページ <code>/ai-tools</code> に並ぶAI。上から順に表示されます。
          </p>
        </div>
        <Link
          to="/admin/ai-tools/new"
          className="rounded-lg bg-primary-500 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-600"
        >
          ＋ 新しいAI
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-[12px] leading-relaxed text-amber-900">
          <p className="font-bold">Supabaseの ai_tools テーブルがまだ無いようです。</p>
          <p className="mt-1">
            <code>システム/アフィサイト/AIツール図鑑_supabase.sql</code> の内容を
            Supabaseの SQL Editor に貼って実行すると、この画面から追加できるようになります。
          </p>
          <p className="mt-1 opacity-70">（{error}）</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-background-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-foreground-500">読み込み中…</p>
        ) : tools.length === 0 ? (
          <p className="p-6 text-center text-sm text-foreground-500">まだ登録がありません。</p>
        ) : (
          tools.map((tool, index) => {
            const count = clicks.get(tool.id);
            return (
              <div
                key={tool.id}
                className="flex items-center gap-2 border-b border-background-100 px-2 py-2.5 last:border-0 sm:gap-3 sm:px-4"
              >
                <div className="flex shrink-0 flex-col">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="ひとつ上へ"
                    className="px-1 text-foreground-300 hover:text-foreground-700 disabled:opacity-25"
                  >
                    <i className="ri-arrow-up-s-line text-lg" />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === tools.length - 1}
                    aria-label="ひとつ下へ"
                    className="px-1 text-foreground-300 hover:text-foreground-700 disabled:opacity-25"
                  >
                    <i className="ri-arrow-down-s-line text-lg" />
                  </button>
                </div>

                <div
                  className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                  style={{ backgroundImage: `linear-gradient(160deg, ${tool.bgFrom}, ${tool.bgTo})` }}
                >
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <i className={`${tool.icon} text-lg`} style={{ color: tool.accentColor }} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="truncate text-sm font-medium">{tool.name}</span>
                    {tool.referral.status === 'needs_review' && (
                      <span className="shrink-0 rounded bg-amber-500 px-1.5 py-[1px] text-[9px] font-black text-white">
                        条件未確認
                      </span>
                    )}
                    <span className="flex shrink-0 items-center gap-1">
                      {KIND_META.map((k) => {
                        const n = count?.[k.key] ?? 0;
                        return (
                          <span
                            key={k.key}
                            title={`${k.hint}：累計 ${n}`}
                            className="inline-flex items-center gap-1 rounded py-[1px] pl-1.5 pr-1 text-[10px] font-bold text-white"
                            style={{ background: k.color }}
                          >
                            {k.label}
                            <span className={`tabular-nums rounded px-1 ${n > 0 ? 'bg-white/25' : 'opacity-50'}`}>
                              {n}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-foreground-500">
                    <span className="truncate">{tool.company}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-bold ${
                        tool.isPublished ? 'bg-primary-50 text-primary-700' : 'bg-background-200 text-foreground-500'
                      }`}
                    >
                      {tool.isPublished ? '公開中' : '下書き'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => togglePublished(tool)}
                    className="whitespace-nowrap rounded-md border border-background-300 px-2 py-1 text-[11px] font-semibold hover:bg-background-100"
                  >
                    {tool.isPublished ? '非公開' : '公開'}
                  </button>
                  <Link
                    to={`/admin/ai-tools/${tool.id}`}
                    className="rounded-md border border-background-300 px-2 py-1 text-[11px] font-semibold hover:bg-background-100"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => remove(tool)}
                    aria-label="削除"
                    className="rounded-md border border-background-300 px-1.5 py-1 text-[13px] text-foreground-400 hover:bg-background-100"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
