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
  const { user, role, logout, nome } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const initials = nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = role === 'admin' ? 'Admin' : role === 'operadora' ? 'Operadora' : 'Viewer';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#e8eaed] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center">
        <MobileNav />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-[#e8eaed]/60">
              <Bell className="w-5 h-5 text-[#4e7fa6]" />
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
                          !notif.lida ? 'text-[#0d2f52]' : 'text-slate-600'
                        }`}
                      >
                        {notif.titulo}
                      </span>
                      {!notif.lida && (
                        <span className="w-2 h-2 bg-[#7aadc8] rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                      {notif.mensagem}
                    </span>
                    {notif.patientId && (
                      <Link
                        to={`/pacientes/${notif.patientId}`}
                        className="text-xs text-[#4e7fa6] hover:text-[#0d2f52] hover:underline mt-1 font-medium"
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
            <Button variant="ghost" className="flex items-center gap-3 h-10 px-2 hover:bg-[#e8eaed]/60">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-[#0d2f52] to-[#4e7fa6] text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start leading-none gap-0.5">
                <span className="text-sm font-semibold text-[#0d2f52] leading-tight">
                  {nome}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {user?.email}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-3.5 bg-[#7aadc8]/15 text-[#0d2f52] border-[#7aadc8]/30 uppercase font-semibold">
                    {roleLabel}
                  </Badge>
                </div>
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
