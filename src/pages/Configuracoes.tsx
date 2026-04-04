import { User, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function Configuracoes() {
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
              <Label className="text-slate-500">Nome</Label>
              <p className="font-medium">Fernando Silva</p>
            </div>
            <div>
              <Label className="text-slate-500">E-mail</Label>
              <p className="font-medium">fernando@qualitylife.com.br</p>
            </div>
            <div>
              <Label className="text-slate-500">Função</Label>
              <p className="font-medium">Administrador</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Editar Perfil
          </Button>
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
              <p className="font-medium">Notificações por e-mail</p>
              <p className="text-sm text-slate-500">Receba atualizações importantes no seu e-mail</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de planos vencendo</p>
              <p className="text-sm text-slate-500">Seja notificado quando planos estiverem próximos do vencimento</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resumo semanal</p>
              <p className="text-sm text-slate-500">Receba um resumo semanal da operação</p>
            </div>
            <Switch />
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
              <p className="font-medium">Autenticação de dois fatores</p>
              <p className="text-sm text-slate-500">Adicione uma camada extra de segurança</p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alterar senha</p>
              <p className="text-sm text-slate-500">Atualize sua senha periodicamente</p>
            </div>
            <Button variant="outline" size="sm">
              Alterar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
