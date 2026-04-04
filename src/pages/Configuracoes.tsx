import { User, Bell, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { MfaConfig } from '@/components/MfaConfig';

export function Configuracoes() {
  const { user, role, logout } = useAuth();

  const roleLabel =
    role === 'admin'
      ? 'Administrador'
      : role === 'operadora'
        ? 'Operadora'
        : 'Visualizador';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500">Gerencie suas preferências do sistema</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-500">E-mail</Label>
              <p className="font-medium">{user?.email || '-'}</p>
            </div>
            <div>
              <Label className="text-slate-500">Função</Label>
              <p className="font-medium">{roleLabel}</p>
            </div>
            <div>
              <Label className="text-slate-500">ID da Sessão</Label>
              <p className="font-mono text-xs text-slate-400">
                {user?.id?.slice(0, 12)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de planos vencendo</p>
              <p className="text-sm text-slate-500">
                Seja notificado quando planos estiverem próximos do vencimento
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alerta de 48h úteis (pendente ativação)</p>
              <p className="text-sm text-slate-500">
                Notificação quando a Quality Life ultrapassar o prazo de ativação
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sessão ativa</p>
              <p className="text-sm text-slate-500">
                Sua sessão expira após 8 horas de inatividade
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Encerrar Sessão
            </Button>
          </div>
          
          <Separator />
          
          <div className="pt-2">
            <h3 className="font-medium mb-4">Autenticação de Dois Fatores (MFA/2FA)</h3>
            <MfaConfig />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
