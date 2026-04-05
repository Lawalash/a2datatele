import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

export function MfaConfig() {
  const [factors, setFactors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    fetchMfaStatus();
  }, []);

  const fetchMfaStatus = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      toast.error('Erro ao buscar status de MFA');
    } else {
      setFactors(data.totp || []);
    }
    setIsLoading(false);
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Remove old unverified factors to prevent "already exists" error
    const { data: listData } = await supabase.auth.mfa.listFactors();
    const unverified = listData?.all.filter((f: any) => f.status === 'unverified' && f.factor_type === 'totp');
    if (unverified && unverified.length > 0) {
      for (const f of unverified) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'A2 DATA Telemedicina',
      friendlyName: user?.email || 'Usuário',
    });
    
    setIsEnrolling(false);

    if (error) {
      toast.error('Erro ao iniciar 2FA: ' + error.message);
      return;
    }

    setFactorId(data.id);
    setQrCodeData(data.totp.qr_code); // Retorna uma string SVG nativamente
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;

    setIsLoading(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: verifyCode,
    });
    
    setIsLoading(false);

    if (error) {
      toast.error('Código inválido: ' + error.message);
    } else {
      toast.success('Autenticação de Dois Fatores habilitada com sucesso!');
      setQrCodeData(null);
      setFactorId(null);
      fetchMfaStatus();
    }
  };

  const handleUnenroll = async (id?: string) => {
    if (!id) {
      toast.error('Nenhum fator 2FA encontrado para desativar.');
      return;
    }
    const { error } = await supabase.auth.mfa.unenroll({
      factorId: id
    });
    if (error) {
      toast.error('Erro ao desativar 2FA: ' + error.message);
    } else {
      toast.success('2FA desativada com sucesso');
      fetchMfaStatus();
    }
  };

  const isMfaEnabled = factors.filter((f) => f.status === 'verified').length > 0;

  return (
    <div className="space-y-4">
      {isLoading && factors.length === 0 ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isMfaEnabled ? (
        <div className="p-4 bg-[#7aadc8]/10 border border-[#7aadc8]/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#4e7fa6]" />
            <div>
              <p className="font-medium text-[#0d2f52]">2FA Habilitada</p>
              <p className="text-sm text-[#4e7fa6]">Sua conta está protegida por Autenticação de Dois Fatores.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleUnenroll(factors.find(f => f.status === 'verified')?.id)}
          >
            Desativar
          </Button>
        </div>
      ) : qrCodeData ? (
        <form onSubmit={handleVerify} className="p-4 border rounded-lg space-y-4">
          <p className="font-medium">1. Escaneie o QR Code no seu Authenticator (Google/Authy)</p>
          <div className="bg-white p-2 inline-block rounded-lg shadow-sm border" dangerouslySetInnerHTML={{ __html: qrCodeData }} />
          
          <div className="space-y-2">
            <Label htmlFor="code">2. Digite o código de 6 dígitos</Label>
            <Input 
              id="code" 
              value={verifyCode} 
              onChange={(e) => setVerifyCode(e.target.value)} 
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setQrCodeData(null)}>Cancelar</Button>
            <Button type="submit" className="bg-[#0d2f52]" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Verificar
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <div>
              <p className="font-medium text-slate-900">2FA Desabilitada</p>
              <p className="text-sm text-slate-500">Adicione uma camada extra de segurança usando um aplicativo Authenticator.</p>
            </div>
          </div>
          <Button onClick={handleEnroll} disabled={isEnrolling} className="bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6] hover:from-[#0a2440] hover:to-[#3d6e95]">
            {isEnrolling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Habilitar 2FA'}
          </Button>
        </div>
      )}
    </div>
  );
}
