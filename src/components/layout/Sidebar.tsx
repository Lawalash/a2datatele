import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HeartPulse,
  DollarSign,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar({ inSheet = false }: { inSheet?: boolean }) {
  const { logout, role } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'operadora', 'viewer'] },
    { icon: Users, label: 'Pacientes', path: '/pacientes', roles: ['admin', 'operadora', 'viewer'] },
    { icon: DollarSign, label: 'Planos', path: '/planos', roles: ['admin'] },
    { icon: Settings, label: 'Configurações', path: '/configuracoes', roles: ['admin'] },
  ];

  const visibleItems = menuItems.filter(
    (item) => role && item.roles.includes(role)
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    window.location.reload();
  };

  const roleLabel =
    role === 'admin' ? 'Administrador' : role === 'operadora' ? 'Operadora' : 'Visualizador';

  return (
    <aside
      className={cn(
        'w-64 sidebar-gradient text-white flex flex-col z-50',
        inSheet ? 'h-full' : 'fixed left-0 top-0 h-full hidden lg:flex'
      )}
    >
      {/* ── Brand Header ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7aadc8] to-[#4e7fa6] flex items-center justify-center shadow-lg shadow-[#7aadc8]/20">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[17px] leading-tight tracking-tight text-white">
              Quality Life
            </h1>
            <p className="text-[11px] text-[#7aadc8] font-medium tracking-wide uppercase">
              Telemedicina
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 h-px bg-white/10" />

      {/* ── Role indicator ── */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7aadc8] animate-pulse-dot" />
          <span className="text-[11px] text-[#7aadc8]/80 font-medium uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#7aadc8]" />
                )}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-[#7aadc8]/20 text-[#7aadc8]'
                      : 'text-white/50 group-hover:text-white/80'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                </div>
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#7aadc8]/60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 h-px bg-white/10" />

      {/* ── Footer — Developed by A2DATA ── */}
      <div className="px-5 py-4">
        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
          Desenvolvido por
        </p>
        <a
          href="https://www.instagram.com/a2data_/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 transition-all duration-200"
        >
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#7aadc8] to-[#4e7fa6] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#7aadc8] transition-all duration-300">
            A2 DATA
          </span>
          <ExternalLink className="w-3 h-3 text-[#7aadc8]/50 group-hover:text-white/70 transition-colors" />
        </a>
      </div>
    </aside>
  );
}
