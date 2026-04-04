import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HeartPulse,
  DollarSign,
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

  // Filtra items conforme a role do usuário
  const visibleItems = menuItems.filter(
    (item) => role && item.roles.includes(role)
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <aside className={cn(
      "w-64 bg-slate-900 text-white flex flex-col z-50",
      inSheet ? "h-full" : "fixed left-0 top-0 h-full hidden lg:flex"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Quality Life</h1>
            <p className="text-xs text-slate-400">Telemedicina</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role indicator */}
      <div className="px-6 py-2 border-t border-slate-800">
        <p className="text-xs text-slate-500">
          Perfil: <span className="text-slate-400 capitalize">{role || '...'}</span>
        </p>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
