import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import Login from './Login';

const NAV = [
  { to: '/admin', end: true, icon: 'ri-bar-chart-box-line', label: 'ダッシュボード', short: '分析' },
  { to: '/admin/items', end: false, icon: 'ri-archive-line', label: '商品入稿・管理', short: '商品' },
  { to: '/admin/banners', end: false, icon: 'ri-image-2-line', label: 'バナー設定', short: 'バナー' },
  { to: '/admin/logs', end: false, icon: 'ri-cursor-line', label: 'クリックログ', short: 'ログ' },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100">
        <i className="ri-loader-4-line text-2xl text-foreground-400 animate-spin" />
      </div>
    );
  }
  if (!session) return <Login />;

  const sideClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? 'bg-primary-500 text-white' : 'text-foreground-300 hover:bg-white/5 hover:text-white'
    }`;

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 gap-0.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
      isActive ? 'bg-primary-500 text-white' : 'text-foreground-300'
    }`;

  const doLogout = async () => { await signOut(); navigate('/admin'); };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-100">
      {/* モバイル：上部バー＋タブ */}
      <header className="md:hidden sticky top-0 z-30 bg-foreground-950 text-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="font-bold text-sm flex items-center gap-1.5">📒 いいもの図鑑</span>
          <button onClick={doLogout} className="text-[11px] px-2.5 py-1 rounded-lg border border-white/20 text-foreground-200">
            ログアウト
          </button>
        </div>
        <nav className="flex gap-1 px-2 pb-2">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={tabClass}>
              <i className={`${n.icon} text-base`} />
              {n.short}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* PC：左サイドバー */}
      <aside className="hidden md:flex w-56 shrink-0 bg-foreground-950 text-white flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 font-bold text-[15px] flex items-center gap-2 border-b border-white/10">
          <span>📒</span> いいもの図鑑
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={sideClass}>
              <i className={n.icon} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 text-xs">
          <div className="text-foreground-200 mb-2 truncate">{session.user.email}</div>
          <button
            onClick={doLogout}
            className="w-full py-1.5 rounded-lg border border-white/20 text-foreground-200 hover:bg-white/5"
          >
            ログアウト
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
