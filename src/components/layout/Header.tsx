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
import type { Usuario, Notificacao } from '@/types';
import { formatDateTime } from '@/utils/formatters';

interface HeaderProps {
  usuario: Usuario;
  notificacoes: Notificacao[];
  onMarcarLida?: (id: string) => void;
}

export function Header({ usuario, notificacoes, onMarcarLida }: HeaderProps) {
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumb ou título pode ir aqui */}
      <div />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {notificacoesNaoLidas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notificacoesNaoLidas.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificações</span>
              {notificacoesNaoLidas.length > 0 && (
                <span className="text-xs text-slate-500">
                  {notificacoesNaoLidas.length} não lidas
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificacoes.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                Nenhuma notificação
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notificacoes.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => onMarcarLida?.(notif.id)}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span className={`font-medium text-sm ${!notif.lida ? 'text-slate-900' : 'text-slate-600'}`}>
                        {notif.titulo}
                      </span>
                      {!notif.lida && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                      {notif.mensagem}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      {formatDateTime(notif.data)}
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
                  {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-900 leading-tight">
                  {usuario.nome}
                </span>
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4 mt-0.5">
                  {usuario.role}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
