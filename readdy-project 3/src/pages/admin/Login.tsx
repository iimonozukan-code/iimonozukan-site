import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) setError('ログインできませんでした。メール・パスワードをご確認ください。');
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-background-200 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">📒</div>
          <h1 className="text-lg font-semibold text-foreground-950">いいもの図鑑 管理画面</h1>
          <p className="text-xs text-foreground-500 mt-1">運営者専用</p>
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 text-xs bg-primary-50 text-primary-700 rounded-lg p-3">
            Supabaseが未設定です。環境変数 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定してください。
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground-600 mb-1.5">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground-600 mb-1.5">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-background-300 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          {error && <p className="text-xs text-primary-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-lg bg-foreground-950 text-white text-sm font-semibold hover:bg-foreground-800 disabled:opacity-50"
          >
            {busy ? '確認中…' : 'ログイン'}
          </button>
        </form>
        <p className="mt-5 text-[11px] text-foreground-400 text-center">
          🔒 この画面とクリックログは閲覧者には表示されません
        </p>
      </div>
    </div>
  );
}
