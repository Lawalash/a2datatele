import { Link } from 'react-router-dom';
import { Bell, User, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateTime } from '@/utils/formatters';

import { MobileNav } from './MobileNav';

export function Header() {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const userName = user?.email?.split('@')[0] || 'Usuário';
  const initials = userName.slice(0, 2).toUpperCase();
  const roleLabel = role === 'admin' ? 'Admin' : role === 'operadora' ? 'Operadora' : 'Viewer';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center">
        <MobileNav />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {unreadCount > 0 && (
                <span className="text-xs text-red-500 font-medium">
                  {unreadCount} pendente(s)
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                Nenhuma notificação
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span
                        className={`font-medium text-sm ${
                          !notif.lida ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {notif.titulo}
                      </span>
                      {!notif.lida && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                      {notif.mensagem}
                    </span>
                    {notif.patientId && (
                      <Link
                        to={`/pacientes/${notif.patientId}`}
                        className="text-xs text-emerald-600 hover:underline mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver paciente →
                      </Link>
                    )}
                    <span className="text-xs text-slate-400 mt-1">
                      Enviado em {formatDateTime(notif.data)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-10 px-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900 leading-tight">
                  {user?.email}
                </span>
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4 mt-0.5">
                  {roleLabel}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/configuracoes">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => logout()}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
