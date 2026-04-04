import { useState } from 'react';
import { User, Shield, LogOut, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { MfaConfig } from '@/components/MfaConfig';
import { useProfiles, useUpdateProfileName, useUpdatePassword, useUpdateRole } from '@/hooks/useProfiles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Configuracoes() {
  const { user, role, logout, isAdmin } = useAuth();
  
  const { data: perfis, isLoading: perfisLoad } = useProfiles();
  const updateNameMutation = useUpdateProfileName();
  const updatePassMutation = useUpdatePassword();
  const updateRoleMutation = useUpdateRole();

  const [novoNome, setNovoNome] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const roleLabel =
    role === 'admin'
      ? 'Administrador'
      : role === 'operadora'
        ? 'Operadora'
        : 'Visualizador';

  const meuPerfil = perfis?.find((p: any) => p.id === user?.id);

  const handleUpdateName = () => {
    if (!novoNome) return;
    if (user?.id) {
      updateNameMutation.mutate({ userId: user.id, nome: novoNome });
      setNovoNome('');
    }
  };

  const handleUpdatePassword = () => {
    if (!user?.email || !senhaAtual || !novaSenha || novaSenha.length < 6) return;
    updatePassMutation.mutate({
      email: user.email,
      oldPassword: senhaAtual,
      newPassword: novaSenha
    });
    setSenhaAtual('');
    setNovaSenha('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500">Gerencie suas preferências do sistema</p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
          {isAdmin && <TabsTrigger value="equipe">Gerenciar Equipe</TabsTrigger>}
        </TabsList>

        <TabsContent value="perfil" className="space-y-6 mt-6">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Dados do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Nome Atual</Label>
                  <p className="font-medium text-lg">{meuPerfil?.nome || user?.email}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Função</Label>
                  <p className="font-medium text-lg">{roleLabel}</p>
                </div>
                <div>
                  <Label className="text-slate-500">E-mail de Acesso</Label>
                  <p className="font-medium">{user?.email || '-'}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Alterar Nome */}
                <div className="space-y-3">
                  <Label>Alterar Nome de Exibição</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ex: João Silva" 
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />
                    <Button 
                      onClick={handleUpdateName}
                      disabled={updateNameMutation.isPending || !novoNome}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>

                {/* Alterar Senha */}
                <div className="space-y-3">
                  <Label>Redefinir Senha</Label>
                  <div className="flex flex-col gap-2">
                    <Input 
                      type="password"
                      placeholder="Senha Atual" 
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                    <Input 
                      type="password"
                      placeholder="Nova senha (min. 6 carateres)" 
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                    <Button 
                      onClick={handleUpdatePassword}
                      disabled={updatePassMutation.isPending || novaSenha.length < 6 || !senhaAtual}
                      variant="outline"
                      className="w-[140px]"
                    >
                      Atualizar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segurança & Sessão */}
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
                    Sua ID de sessão: <span className="font-mono bg-slate-100 p-1 rounded">{user?.id?.slice(0, 8)}...</span>
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
        </TabsContent>

        {/* ========================================================= */}
        {/* ABA DA EQUIPE (Apenas Admin) */}
        {/* ========================================================= */}
        {isAdmin && (
          <TabsContent value="equipe" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Perfis Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {perfisLoad ? (
                  <p className="text-sm text-slate-500">Carregando perfis...</p>
                ) : (
                  <div className="space-y-4">
                    {perfis?.map((perfil: any) => (
                      <div key={perfil.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-900">{perfil.nome || 'Usuário Sem Nome'}</p>
                          <p className="text-sm text-slate-500 font-mono">ID: {perfil.id.slice(0, 8)}...</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select 
                            defaultValue={perfil.role}
                            onValueChange={(val) => updateRoleMutation.mutate({ profileId: perfil.id, role: val })}
                          >
                            <SelectTrigger className="w-[140px] bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="operadora">Operadora</SelectItem>
                              <SelectItem value="viewer">Visualizador</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {perfil.role === 'admin' && <Shield className="w-5 h-5 text-emerald-600" />}
                          {perfil.role === 'operadora' && <User className="w-5 h-5 text-blue-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

      </Tabs>
    </div>
  );
}
