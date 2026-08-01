import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAiTool, fetchAiTool, toolToInput, updateAiTool, type AiToolInput } from '@/lib/aiTools';
import type { AiToolStatus } from '@/data/aiTools';
import { uploadImage } from '@/lib/db';

const ICONS = [
  { value: 'ri-sparkling-line', label: '✨ 汎用AI' },
  { value: 'ri-chat-3-line', label: '💬 チャット' },
  { value: 'ri-mic-2-line', label: '🎙 音声' },
  { value: 'ri-music-2-line', label: '🎵 音楽' },
  { value: 'ri-movie-2-line', label: '🎬 動画' },
  { value: 'ri-image-2-line', label: '🖼 画像' },
  { value: 'ri-code-s-slash-line', label: '💻 開発' },
  { value: 'ri-file-text-line', label: '📝 文章' },
  { value: 'ri-search-eye-line', label: '🔍 調査' },
  { value: 'ri-robot-2-line', label: '🤖 エージェント' },
];

const STATUS: { value: AiToolStatus; label: string }[] = [
  { value: 'active', label: '条件を確認済み' },
  { value: 'needs_review', label: '条件が未確認（公開前に確認する）' },
  { value: 'paused', label: '受付停止中（登録ボタンを出さない）' },
];

const EMPTY: AiToolInput = {
  name: '',
  company: '',
  icon: 'ri-sparkling-line',
  accentColor: '#1578d3',
  bgFrom: '#eef7ff',
  bgTo: '#d8e9fa',
  logoUrl: null,
  imageUrl: null,
  taglineJa: '',
  taglineEn: '',
  descriptionJa: '',
  descriptionEn: '',
  categoriesJa: [],
  categoriesEn: [],
  pricingJa: '',
  pricingEn: '',
  referralUrl: '',
  referralCode: '',
  referralLabelJa: '無料ではじめる招待リンク',
  referralLabelEn: '',
  benefitJa: '',
  benefitEn: '',
  disclosureJa: '',
  disclosureEn: '',
  ctaJa: '',
  ctaEn: '',
  shortCtaJa: '無料で試す',
  shortCtaEn: '',
  checkedAt: '',
  status: 'needs_review',
  isPublished: false,
};

const LABEL = 'block text-[11px] font-bold text-foreground-500 mb-1';
const INPUT =
  'w-full rounded-lg border border-background-300 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none';
const SECTION = 'rounded-2xl border border-background-200 bg-white p-4 md:p-5 space-y-3';

export default function AiToolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AiToolInput>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchAiTool(Number(id))
      .then((tool) => {
        if (tool) setForm(toolToInput(tool));
      })
      .catch((e: unknown) => setMessage(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof AiToolInput>(key: K, value: AiToolInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set('imageUrl', url);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) {
      setMessage('ツール名を入れてください');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      if (isEdit) await updateAiTool(Number(id), form);
      else await createAiTool(form);
      navigate('/admin/ai-tools');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-sm text-foreground-500">読み込み中…</p>;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/ai-tools')}
          className="rounded-lg border border-background-300 px-2.5 py-1.5 text-[12px] font-semibold hover:bg-background-100"
        >
          ← 戻る
        </button>
        <h1 className="text-lg font-bold">{isEdit ? 'AIを編集' : '新しいAI'}</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <section className={SECTION}>
            <h2 className="text-sm font-bold">基本</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>名前（必須）</label>
                <input className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Claude" />
              </div>
              <div>
                <label className={LABEL}>提供会社</label>
                <input className={INPUT} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Anthropic" />
              </div>
            </div>

            <div>
              <label className={LABEL}>キャッチコピー（日本語）</label>
              <input
                className={INPUT}
                value={form.taglineJa}
                onChange={(e) => set('taglineJa', e.target.value)}
                placeholder="考える、書く、作るを、一緒に進めるAI"
              />
            </div>

            <div>
              <label className={LABEL}>説明（日本語）</label>
              <textarea
                className={`${INPUT} min-h-[80px]`}
                value={form.descriptionJa}
                onChange={(e) => set('descriptionJa', e.target.value)}
                placeholder="どんなことに使えるかを2〜3行で"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>用途カテゴリ（カンマ区切り）</label>
                <input
                  className={INPUT}
                  value={form.categoriesJa.join(', ')}
                  onChange={(e) =>
                    set(
                      'categoriesJa',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    )
                  }
                  placeholder="文章・チャット, 調査, 開発"
                />
              </div>
              <div>
                <label className={LABEL}>料金の目安ラベル</label>
                <input className={INPUT} value={form.pricingJa} onChange={(e) => set('pricingJa', e.target.value)} placeholder="無料プランあり" />
              </div>
            </div>
          </section>

          <section className={SECTION}>
            <h2 className="text-sm font-bold">リンク</h2>
            <div>
              <label className={LABEL}>紹介・アフィリエイトURL</label>
              <input className={INPUT} value={form.referralUrl} onChange={(e) => set('referralUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={LABEL}>招待コード（確認済みのものだけ・無ければ空欄）</label>
              <input className={INPUT} value={form.referralCode} onChange={(e) => set('referralCode', e.target.value)} />
            </div>
          </section>

          <section className={SECTION}>
            <h2 className="text-sm font-bold">表記・開示</h2>
            <p className="text-[11px] leading-relaxed text-foreground-500">
              ラベルは「無料ではじめる招待リンク」のように、<b>読者が受け取れるメリット</b>を前に出す。
              広告である旨はトップの開示文（ヘッダー）でカバーしています。
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>ラベル（読者メリット）</label>
                <input className={INPUT} value={form.referralLabelJa} onChange={(e) => set('referralLabelJa', e.target.value)} placeholder="無料プラン付き招待リンク" />
              </div>
              <div>
                <label className={LABEL}>条件を確認した日</label>
                <input type="date" className={INPUT} value={form.checkedAt} onChange={(e) => set('checkedAt', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={LABEL}>メリット・条件の説明</label>
              <textarea
                className={`${INPUT} min-h-[64px]`}
                value={form.benefitJa}
                onChange={(e) => set('benefitJa', e.target.value)}
                placeholder="無料プランはクレジットカード不要・個人の非商用利用向けです。"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>ボタン文言（ポップアップ内・大）</label>
                <input className={INPUT} value={form.ctaJa} onChange={(e) => set('ctaJa', e.target.value)} placeholder="Fish Audioを無料で試す" />
              </div>
              <div>
                <label className={LABEL}>ボタン文言（カード直下・小）</label>
                <input className={INPUT} value={form.shortCtaJa} onChange={(e) => set('shortCtaJa', e.target.value)} placeholder="無料で試す" />
              </div>
            </div>
            <div>
              <label className={LABEL}>紹介条件の確認状況</label>
              <select className={INPUT} value={form.status} onChange={(e) => set('status', e.target.value as AiToolStatus)}>
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <details className={SECTION}>
            <summary className="cursor-pointer text-sm font-bold">英語表示（任意・空欄なら日本語を表示）</summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className={LABEL}>Tagline</label>
                <input className={INPUT} value={form.taglineEn} onChange={(e) => set('taglineEn', e.target.value)} />
              </div>
              <div>
                <label className={LABEL}>Description</label>
                <textarea className={`${INPUT} min-h-[64px]`} value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Categories（カンマ区切り）</label>
                  <input
                    className={INPUT}
                    value={form.categoriesEn.join(', ')}
                    onChange={(e) =>
                      set(
                        'categoriesEn',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      )
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>Pricing label</label>
                  <input className={INPUT} value={form.pricingEn} onChange={(e) => set('pricingEn', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Label</label>
                  <input className={INPUT} value={form.referralLabelEn} onChange={(e) => set('referralLabelEn', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL}>CTA（大）</label>
                  <input className={INPUT} value={form.ctaEn} onChange={(e) => set('ctaEn', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>CTA（小）</label>
                  <input className={INPUT} value={form.shortCtaEn} onChange={(e) => set('shortCtaEn', e.target.value)} />
                </div>
                <div>
                  <label className={LABEL}>Benefit</label>
                  <input className={INPUT} value={form.benefitEn} onChange={(e) => set('benefitEn', e.target.value)} />
                </div>
              </div>
            </div>
          </details>
        </div>

        <div className="space-y-4">
          <section className={SECTION}>
            <h2 className="text-sm font-bold">見た目</h2>
            <div>
              <label className={LABEL}>サムネ画像（9:16・任意）</label>
              <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} className="w-full text-[11px]" />
              {uploading && <p className="mt-1 text-[11px] text-foreground-500">アップロード中…</p>}
              {form.imageUrl && (
                <button
                  onClick={() => set('imageUrl', null)}
                  className="mt-1 text-[11px] font-semibold text-primary-600 hover:underline"
                >
                  画像を外す（アイコン表示に戻す）
                </button>
              )}
            </div>
            <div>
              <label className={LABEL}>公式ロゴのURL（任意）</label>
              <input
                className={INPUT}
                value={form.logoUrl ?? ''}
                onChange={(e) => set('logoUrl', e.target.value || null)}
                placeholder="https://... （公式サイトのロゴ画像）"
              />
              <p className="mt-1 text-[10px] leading-relaxed text-foreground-400">
                読み込めないときは下のアイコンが代わりに出ます。
              </p>
            </div>
            <div>
              <label className={LABEL}>アイコン（ロゴが無いとき）</label>
              <select className={INPUT} value={form.icon} onChange={(e) => set('icon', e.target.value)}>
                {ICONS.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={LABEL}>文字色</label>
                <input type="color" value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="h-9 w-full rounded-lg border border-background-300" />
              </div>
              <div>
                <label className={LABEL}>背景 上</label>
                <input type="color" value={form.bgFrom} onChange={(e) => set('bgFrom', e.target.value)} className="h-9 w-full rounded-lg border border-background-300" />
              </div>
              <div>
                <label className={LABEL}>背景 下</label>
                <input type="color" value={form.bgTo} onChange={(e) => set('bgTo', e.target.value)} className="h-9 w-full rounded-lg border border-background-300" />
              </div>
            </div>

            <div>
              <p className={LABEL}>プレビュー</p>
              <div className="mx-auto w-[112px]">
                <div
                  className="relative flex aspect-[9/16] flex-col items-center justify-center overflow-hidden rounded-lg px-2 text-center"
                  style={{ backgroundImage: `linear-gradient(160deg, ${form.bgFrom}, ${form.bgTo})` }}
                >
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-sm">
                        {form.logoUrl ? (
                          <img src={form.logoUrl} alt="" className="h-7 w-7 object-contain" />
                        ) : (
                          <i className={`${form.icon} text-2xl`} style={{ color: form.accentColor }} />
                        )}
                      </span>
                      <span className="mt-2.5 text-[15px] font-black leading-tight" style={{ color: form.accentColor }}>
                        {form.name || 'ツール名'}
                      </span>
                      <span className="mt-1.5 text-[9px] font-bold leading-snug text-foreground-700/90">
                        {form.taglineJa}
                      </span>
                    </>
                  )}
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-foreground-950/60 px-1.5 py-0.5 text-[9px] font-black leading-none text-white">
                    PR
                  </span>
                  {form.pricingJa && (
                    <span className="absolute inset-x-0 bottom-1.5 text-[9px] font-black text-foreground-700/80">
                      {form.pricingJa}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={SECTION}>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} />
              公開する
            </label>
            <p className="text-[11px] leading-relaxed text-foreground-500">
              チェックを外すと下書きになり、公開ページには出ません。
            </p>
            {message && <p className="text-[11px] font-semibold text-primary-600">{message}</p>}
            <button
              onClick={save}
              disabled={saving}
              className="w-full rounded-lg bg-primary-500 py-2.5 text-sm font-bold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? '保存中…' : '保存'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
