import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createItem, updateItem, fetchAllItems, uploadImage, placeItemByDate, type ItemInput, type Item } from '@/lib/db';
import type { Product } from '@/mocks/products';

const CATEGORIES: Product['category'][] = ['機械もの', '生活もの', '家電もの', '身装もの', '情報もの'];
const MALLS: { key: keyof Product['links']; label: string; color: string; ph: string }[] = [
  { key: 'amazon', label: 'Amazon', color: '#ff9900', ph: 'https://amzn.to/...' },
  { key: 'rakuten', label: '楽天', color: '#bf0000', ph: 'https://a.r10.to/...' },
  { key: 'yahoo', label: 'Yahoo', color: '#ff0033', ph: 'https://yahoo.jp/...' },
  { key: 'aliexpress', label: 'AliExpress', color: '#ff4747', ph: 'https://s.click.ali...' },
];

export default function ItemForm() {
  const { id } = useParams();
  const isEdit = id != null;
  const navigate = useNavigate();
  const location = useLocation();
  const nav = (location.state as { duplicated?: boolean; fromName?: string } | null) ?? null;
  const isDuplicated = isEdit && nav?.duplicated === true;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('機械もの');
  const [image, setImage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [originalDate, setOriginalDate] = useState<string | null>(null);
  const [asin, setAsin] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isOwn, setIsOwn] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [galUploading, setGalUploading] = useState(false);
  const [links, setLinks] = useState<Product['links']>({ amazon: null, rakuten: null, yahoo: null, aliexpress: null });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const all = await fetchAllItems().catch(() => [] as Item[]);
      const it = all.find((x) => String(x.id) === id);
      if (it) {
        setName(it.name); setCategory(it.category); setImage(it.image);
        setDate(it.date || ''); setOriginalDate(it.date || '');
        setAsin(it.asin ?? ''); setIsPublished(it.isPublished ?? true); setIsOwn(it.isOwn ?? false);
        setGallery(it.gallery ?? []);
        setLinks(it.links);
      }
    })();
  }, [id, isEdit]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr(null);
    try { setImage(await uploadImage(file)); }
    catch (e2) { setErr('画像アップロードに失敗しました: ' + (e2 as Error).message); }
    setUploading(false);
  };

  const onUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalUploading(true); setErr(null);
    try {
      const room = Math.max(0, 6 - gallery.length);
      const picked = files.slice(0, room);
      const urls: string[] = [];
      for (const f of picked) urls.push(await uploadImage(f));
      setGallery((g) => [...g, ...urls].slice(0, 6));
    } catch (e2) { setErr('ギャラリー画像アップロードに失敗: ' + (e2 as Error).message); }
    setGalUploading(false); e.target.value = '';
  };
  const moveGal = (i: number, dir: number) => setGallery((g) => {
    const a = [...g]; const j = i + dir; if (j < 0 || j >= a.length) return g;
    [a[i], a[j]] = [a[j], a[i]]; return a;
  });
  const removeGal = (i: number) => setGallery((g) => g.filter((_, k) => k !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('商品名を入力してください'); return; }
    setBusy(true); setErr(null);
    const input: ItemInput = { name: name.trim(), category, image, date, asin: asin || null, isPublished, isOwn, gallery, links };
    try {
      let focusId: number | null = null;
      if (isEdit && id) {
        focusId = Number(id);
        await updateItem(focusId, input);
        if (date && date !== originalDate) {
          await placeItemByDate(focusId, date).catch(() => {});
        }
      } else {
        focusId = await createItem(input);
        if (focusId != null && date) {
          await placeItemByDate(focusId, date).catch(() => {});
        }
      }
      navigate('/admin/items', focusId != null ? { state: { focusId } } : undefined);
    } catch (e2) {
      setErr('保存に失敗しました: ' + (e2 as Error).message);
      setBusy(false);
    }
  };

  const onCancel = () => {
    navigate('/admin/items', isEdit && id ? { state: { focusId: Number(id) } } : undefined);
  };

  const setLink = (k: keyof Product['links'], v: string) =>
    setLinks((prev) => ({ ...prev, [k]: v.trim() === '' ? null : v.trim() }));

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4">
        <h2 className="text-base font-semibold text-foreground-950">{isDuplicated ? '複製した商品を編集' : isEdit ? '商品を編集' : '新規入稿'}</h2>
        {isDuplicated && (
          <p className="text-xs text-foreground-500 mt-0.5">
            ✅ コピーを<b>下書き</b>として作成しました（元の商品はそのまま）。紹介日などを調整して保存してください。
            公開するには「保存後すぐ公開する」にチェックを。
          </p>
        )}
      </header>
      <form onSubmit={onSubmit} className="p-4 md:p-7 max-w-xl space-y-5">
        <div>
          <label className="block text-xs font-bold mb-1.5">商品画像</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-background-100 flex items-center justify-center overflow-hidden shrink-0 border border-background-200">
              {image ? <img src={image} alt="" className="w-full h-full object-contain" /> : <span className="text-2xl">📦</span>}
            </div>
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={onUpload} className="block text-xs mb-2" />
              {uploading && <p className="text-xs text-foreground-500">アップロード中…</p>}
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="または画像URLを貼り付け"
                className="w-full px-3 py-2 rounded-lg border border-background-300 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5">商品名 <span className="text-primary-600">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">カテゴリ</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])} className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm bg-white focus:outline-none focus:border-primary-500">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">紹介日</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500" />
            <p className="text-[10px] text-foreground-400 mt-1">保存すると、この日付の順番の位置に自動で並びます</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">購入リンク（各モール）</label>
          <div className="space-y-2">
            {MALLS.map((m) => (
              <div key={m.key} className="grid grid-cols-[96px_1fr] gap-2 items-center">
                <span className="text-xs font-bold flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: m.color }} />{m.label}</span>
                <input value={links[m.key] ?? ''} onChange={(e) => setLink(m.key, e.target.value)} placeholder={m.ph} className="px-3 py-2 rounded-lg border border-background-300 text-xs focus:outline-none focus:border-primary-500" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5">ASIN（Amazon商品ID・任意）</label>
          <input value={asin} onChange={(e) => setAsin(e.target.value)} placeholder="B0XXXXXXXX" className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          保存後すぐ公開する
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isOwn} onChange={(e) => setIsOwn(e.target.checked)} />
          <span>🏷️ 自社商品（saunas等）として登録<span className="text-foreground-400 font-normal"> — 一覧・ログで強調表示＆自社商品タブに集計</span></span>
        </label>

        {isOwn && (
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-3">
            <label className="block text-xs font-bold mb-1">🖼️ ギャラリー画像（自社商品LP・最大6枚）</label>
            <p className="text-[10px] text-foreground-500 mb-2 leading-relaxed">
              公開ページで商品カードをタップすると、ここの画像が<b>アマゾン風にスワイプ表示</b>されます。縦長・横長どちらでもOK。◀▶で並べ替え、×で削除。
            </p>
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                {gallery.map((url, i) => (
                  <div key={i} className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden border border-amber-200 bg-white">
                      <img src={url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute top-0.5 left-0.5 text-[9px] font-black text-white bg-foreground-950/70 rounded px-1">{i + 1}</span>
                    <button type="button" onClick={() => removeGal(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shadow" aria-label="削除">×</button>
                    <div className="flex justify-center gap-1 mt-0.5">
                      <button type="button" onClick={() => moveGal(i, -1)} disabled={i === 0} className="px-1.5 rounded bg-white border border-background-300 text-[10px] disabled:opacity-30">◀</button>
                      <button type="button" onClick={() => moveGal(i, 1)} disabled={i === gallery.length - 1} className="px-1.5 rounded bg-white border border-background-300 text-[10px] disabled:opacity-30">▶</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {gallery.length < 6 && (
              <div>
                <input type="file" accept="image/*" multiple onChange={onUploadGallery} className="block text-xs" />
                {galUploading && <p className="text-xs text-foreground-500 mt-1">アップロード中…</p>}
                <p className="text-[10px] text-foreground-400 mt-1">あと{6 - gallery.length}枚追加できます（自動でWebP・幅720pxに最適化）</p>
              </div>
            )}
          </div>
        )}

        {err && <p className="text-xs text-primary-600">{err}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-background-300 text-sm font-semibold hover:bg-background-100">キャンセル</button>
          <button type="submit" disabled={busy} className="px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50">{busy ? '保存中…' : '保存'}</button>
        </div>
      </form>
    </div>
  );
}
