import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPatient,
  updatePatient,
  activatePatients,
  deletePatient,
  cancelPatient,
} from '@/services/patients';
import { insertLog } from '@/services/audit';
import type { PatientInsert, PatientUpdate } from '@/types';
import { toast } from 'sonner';

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PatientInsert) => {
      const result = await createPatient(data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (result) => {
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
    mutationFn: async ({ id, data }: { id: string; data: PatientUpdate }) => {
      const result = await updatePatient(id, data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
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
    mutationFn: async (ids: string[]) => {
      const result = await activatePatients(ids);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, ids) => {
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

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePatient(id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir paciente.');
    },
  });
}

export function useCancelPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await cancelPatient(id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success('Plano cancelado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cancelar paciente.');
    },
  });
}
