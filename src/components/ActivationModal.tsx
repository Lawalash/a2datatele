import { useState } from 'react';
import { Check, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useActivatePatients } from '@/hooks/useMutatePatient';
import type { Patient } from '@/types';
import { removeMask } from '@/utils/formatters';

interface ActivationModalProps {
  open: boolean;
  onClose: () => void;
  patients: Patient[];
}

export function ActivationModal({
  open,
  onClose,
  patients,
}: ActivationModalProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');
  const [activatedPatients, setActivatedPatients] = useState<Patient[]>([]);
  const activateMutation = useActivatePatients();

  const handleActivate = async () => {
    const ids = patients.map((p) => p.id);
    const result = await activateMutation.mutateAsync(ids);
    if (result.data) {
      setActivatedPatients(patients);
      setStep('success');
    }
  };

  const handleWhatsApp = (patient: Patient) => {
    const mensagem = encodeURIComponent(
      `Olá ${patient.nome}! Seu plano de telemedicina está ATIVO! 🎉 ` +
        `Você deve ter recebido um e-mail com suas credenciais de acesso. ` +
        `Para agendar suas consultas acesse: ` +
        `https://acesso.qualitylifebrasil.com.br/ords/f?p=185:9996:112948559360266::::: ` +
        `— Qualquer dúvida, estamos à disposição!`
    );
    const numero = removeMask(patient.celular);
    window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
  };

  const handleClose = () => {
    setStep('confirm');
    setActivatedPatients([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                Confirmar Ativação
              </DialogTitle>
              <DialogDescription>
                Você está prestes a ativar {patients.length} paciente(s). Esta
                ação irá:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Registrar a data/hora de ativação
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Definir expiração para 30 dias após ativação
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Alterar status para &quot;ATIVO&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Registrar no log de auditoria
                </li>
              </ul>

              <div className="bg-slate-50 rounded-lg p-3 mt-4">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Pacientes selecionados:
                </p>
                {patients.map((p) => (
                  <p key={p.id} className="text-sm text-slate-700">
                    • {p.nome}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleActivate}
                disabled={activateMutation.isPending}
              >
                {activateMutation.isPending ? 'Ativando...' : 'Confirmar Ativação'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600">
                <Check className="w-5 h-5" />
                Ativação Concluída!
              </DialogTitle>
              <DialogDescription>
                {activatedPatients.length} paciente(s) ativado(s) com sucesso.
                Envie a mensagem de boas-vindas via WhatsApp.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {activatedPatients.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{p.nome}</p>
                    <p className="text-sm text-slate-500">{p.celular}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => handleWhatsApp(p)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleClose}>Fechar</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
