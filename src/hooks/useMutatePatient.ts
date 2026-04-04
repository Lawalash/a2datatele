import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPatient,
  updatePatient,
  activatePatients,
} from '@/services/patients';
import { insertLog } from '@/services/audit';
import type { PatientInsert, PatientUpdate } from '@/types';
import { toast } from 'sonner';

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientInsert) => createPatient(data),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Paciente cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      if (result.data) {
        insertLog('create_patient', result.data.id, {
          nome: result.data.nome,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cadastrar paciente.');
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientUpdate }) =>
      updatePatient(id, data),
    onSuccess: (result, variables) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Paciente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      insertLog('update_patient', variables.id, {
        fields: Object.keys(variables.data),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar paciente.');
    },
  });
}

export function useActivatePatients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => activatePatients(ids),
    onSuccess: (result, ids) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${ids.length} paciente(s) ativado(s) com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      for (const id of ids) {
        insertLog('activate_patient', id);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao ativar pacientes.');
    },
  });
}
