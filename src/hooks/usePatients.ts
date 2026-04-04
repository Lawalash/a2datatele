import { useQuery } from '@tanstack/react-query';
import {
  getPatients,
  getPatient,
  getPricingPlans,
} from '@/services/patients';
import type { StatusPaciente } from '@/types';

export function usePatients(filters?: {
  search?: string;
  status?: StatusPaciente | 'todos';
  page?: number;
  perPage?: number;
}) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const result = await getPatients(filters);
      if (result.error) throw new Error(result.error);
      return { patients: result.data!, count: result.count };
    },
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não informado');
      const result = await getPatient(id);
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!id,
  });
}

export function usePricingPlans() {
  return useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const result = await getPricingPlans();
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
