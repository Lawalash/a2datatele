import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function RedefinirSenha() {
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Escuta o evento PASSWORD_RECOVERY do Supabase para ter a sessão setada e autorizar a mudança.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // O usuário clicou no link e a sessão está pronta para redefinir
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6) {
      return toast.error('A senha deve ter pelo menos 6 caracteres.');
    }

    setCarregando(true);
    const { error } = await supabase.auth.updateUser({
      password: senha
    });
    setCarregando(false);

    if (error) {
      toast.error('Erro ao redefinir a senha: ' + error.message);
    } else {
      toast.success('Senha atualizada com sucesso!');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4e7fa6] to-[#7aadc8] rounded-xl flex items-center justify-center shadow-lg">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Redefinir sua Senha
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Digite a sua nova senha de acesso.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="senha">Nova Senha</Label>
              <div className="mt-1">
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95] flex justify-center"
                disabled={carregando}
              >
                {carregando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Salvar Nova Senha'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
