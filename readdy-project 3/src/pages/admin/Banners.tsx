import { useEffect, useState } from 'react';
import { fetchBanners, saveBanner, uploadImage, type Banner } from '@/lib/db';

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setBanners(await fetchBanners());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (id: number, patch: Partial<Banner>) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    setMsg(null);
    try {
      const url = await uploadImage(file);
      update(id, { image_url: url });
    } catch (err) {
      setMsg('画像アップロードに失敗しました: ' + (err as Error).message);
    }
    setUploadingId(null);
  };

  const onSave = async (b: Banner) => {
    if (b.is_active && !b.image_url) {
      setMsg(`バナー${b.id}：画像が未設定のため表示できません。先に画像をアップロードしてください。`);
      return;
    }
    setSavingId(b.id);
    setMsg(null);
    try {
      await saveBanner(b);
      setMsg(`バナー${b.id}を保存しました。サイトに反映されています。`);
    } catch (err) {
      setMsg('保存に失敗しました: ' + (err as Error).message);
    }
    setSavingId(null);
  };

  return (
    <div>
      <header className="bg-white border-b border-background-200 px-4 md:px-7 py-4">
        <h2 className="text-base font-semibold text-foreground-950">バナー設定</h2>
        <p className="text-xs text-foreground-500">
          サイト最上部に横並びで表示される2枠のバナー（セール告知などに）。推奨サイズ 1200×375px（16:5）
        </p>
      </header>

      <div className="p-4 md:p-7 max-w-3xl space-y-5">
        {msg && (
          <p className={`text-xs font-semibold px-3 py-2 rounded-lg ${msg.includes('失敗') || msg.includes('できません') ? 'bg-primary-50 text-primary-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {msg}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-foreground-400">読み込み中…</p>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-background-200">
              <div className="px-4 py-3 border-b border-background-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold">バナー {b.id}</h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${b.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-background-100 text-foreground-400'}`}>
                  {b.is_active ? '表示中' : '非表示'}
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">バナー画像</label>
                  <div className="w-full max-w-sm rounded-lg overflow-hidden border border-background-200 bg-background-50 aspect-[16/5] flex items-center justify-center">
                    {b.image_url ? (
                      <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-foreground-300">画像未設定</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => onUpload(b.id, e)} className="block text-xs mt-2" />
                  {uploadingId === b.id && <p className="text-xs text-foreground-500 mt-1">アップロード中…（自動で軽量化されます）</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">リンク先URL（タップで開くページ）</label>
                  <input
                    value={b.link_url ?? ''}
                    onChange={(e) => update(b.id, { link_url: e.target.value.trim() || null })}
                    placeholder="https://amzn.to/..."
                    className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={b.is_active}
                      onChange={(e) => update(b.id, { is_active: e.target.checked })}
                      className="cursor-pointer"
                    />
                    サイトに表示する
                  </label>
                  <button
                    onClick={() => onSave(b)}
                    disabled={savingId === b.id || uploadingId === b.id}
                    className="px-5 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
                  >
                    {savingId === b.id ? '保存中…' : '保存'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <p className="text-[11px] text-foreground-400 leading-relaxed">
          ・1枠だけ表示中にすると横幅いっぱいに1枚で表示されます（2枠なら横並び）<br />
          ・バナーのクリック数は「クリックログ」に banner1 / banner2 として記録されます
        </p>
      </div>
    </div>
  );
}
