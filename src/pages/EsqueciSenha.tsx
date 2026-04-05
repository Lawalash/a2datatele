import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Digite seu e-mail.');

    setEnviando(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setEnviando(false);

    if (error) {
      toast.error('Erro ao enviar link: ' + error.message);
    } else {
      setSucesso(true);
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
          Recuperar Senha
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Lembrou a senha?{' '}
          <Link to="/login" className="font-medium text-[#4e7fa6] hover:text-[#0d2f52]">
            Fazer login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {sucesso ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#7aadc8]" />
              <h3 className="text-lg font-medium text-slate-900">E-mail enviado!</h3>
              <p className="text-sm text-slate-500">
                Verifique sua caixa de entrada (e pasta de spam) para receber o link de redefinição de senha.
              </p>
              <Link to="/login" className="block mt-4">
                <Button className="w-full bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95]">
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Endereço de E-mail</Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95] flex justify-center"
                  disabled={enviando}
                >
                  {enviando ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
