import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/useAuth';
import Login from './Login';

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

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? 'bg-primary-500 text-white' : 'text-foreground-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-background-100">
      <aside className="w-56 shrink-0 bg-foreground-950 text-white flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 font-bold text-[15px] flex items-center gap-2 border-b border-white/10">
          <span>📒</span> いいもの図鑑
        </div>
        <nav className="p-3 flex-1 space-y-1">
          <NavLink to="/admin" end className={navClass}><i className="ri-bar-chart-box-line" /> ダッシュボード</NavLink>
          <NavLink to="/admin/items" className={navClass}><i className="ri-archive-line" /> 商品入稿・管理</NavLink>
          <NavLink to="/admin/logs" className={navClass}><i className="ri-cursor-line" /> クリックログ</NavLink>
        </nav>
        <div className="p-3 border-t border-white/10 text-xs">
          <div className="text-foreground-200 mb-2 truncate">{session.user.email}</div>
          <button
            onClick={async () => { await signOut(); navigate('/admin'); }}
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
