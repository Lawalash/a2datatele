import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login, verifyMfa, logout, isAuthenticated, mfaRequired } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [fase, setFase] = useState<'login' | 'mfa'>('login');
  const [mfaCode, setMfaCode] = useState('');

  // Se já está autenticado (e não precisa de MFA), redireciona
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2f52] via-[#0a2440] to-[#04111f]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white/80 text-sm font-medium tracking-wide">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se o login exige MFA logo de cara (ex: refresh na página)
  useEffect(() => {
    if (mfaRequired && fase !== 'mfa') {
      setFase('mfa');
    }
  }, [mfaRequired, fase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    const { error } = await login(email, senha);
    setCarregando(false);

    if (error) {
      if (error === 'MFA_REQUIRED') {
        setFase('mfa');
        toast.success('Validação em duas etapas necessária.');
        return;
      }
      if (error.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos.');
      } else {
        toast.error(error);
      }
      return;
    }

    toast.success('Login realizado com sucesso!');
    navigate('/dashboard');
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode.trim() || mfaCode.length < 6) {
      toast.error('Digite o código de 6 dígitos.');
      return;
    }

    setCarregando(true);
    const { error } = await verifyMfa(mfaCode);
    setCarregando(false);

    if (error) {
      toast.error('Código 2FA incorreto ou expirado.');
      return;
    }

    toast.success('Login realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2f52] via-[#0a2440] to-[#071c33] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#4e7fa6]/10 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#7aadc8]/10 blur-3xl" />
      
      <Card className="w-full max-w-md shadow-2xl border-0 relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#4e7fa6] to-[#7aadc8] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-[#4e7fa6]/25">
              <HeartPulse className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0d2f52]">Quality Life</h1>
            <p className="text-[#4e7fa6]">Sistema de Gestão - Telemedicina</p>
          </div>
        </CardHeader>

        <CardContent>
          {fase === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0d2f52] font-medium">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-[#e8eaed] focus:border-[#4e7fa6] focus:ring-[#4e7fa6]/20"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha" className="text-[#0d2f52] font-medium">Senha</Label>
                  <Link to="/esqueci-senha" className="text-sm font-medium text-[#4e7fa6] hover:text-[#0d2f52] transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="h-11 pr-10 border-[#e8eaed] focus:border-[#4e7fa6] focus:ring-[#4e7fa6]/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4e7fa6] transition-colors"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95] text-white font-medium shadow-lg shadow-[#0d2f52]/20 transition-all duration-200"
                disabled={carregando}
              >
                {carregando ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-8 mt-2">
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-semibold text-[#0d2f52]">Verificação em 2 Etapas</h3>
                  <p className="text-sm text-[#4e7fa6]">Digite o código do seu autenticador</p>
                </div>
                
                <div className="flex justify-center">
                  <Input
                    id="mfaCode"
                    type="text"
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="h-20 w-full max-w-[280px] text-center text-4xl tracking-[0.4em] font-bold text-[#0d2f52] bg-slate-50/50 border-2 border-[#e8eaed] focus:bg-white focus:border-[#4e7fa6] focus:ring-4 focus:ring-[#4e7fa6]/10 transition-all duration-300 rounded-xl placeholder:text-slate-200 placeholder:font-normal shadow-inner"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setCarregando(true);
                    await logout();
                    setFase('login');
                    setCarregando(false);
                  }}
                  disabled={carregando}
                  className="flex-1 h-11 border-[#4e7fa6]/30 text-[#0d2f52]"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] h-11 bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95] text-white font-medium shadow-lg shadow-[#0d2f52]/20"
                  disabled={carregando || mfaCode.length < 6}
                >
                  {carregando ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-[#e8eaed] text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              Desenvolvido por
            </p>
            <a
              href="https://www.instagram.com/a2data_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] bg-clip-text text-transparent hover:from-[#4e7fa6] hover:to-[#7aadc8] transition-all duration-300"
            >
              A2 DATA
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
