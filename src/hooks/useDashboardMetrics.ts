import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '@/services/patients';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const result = await getDashboardMetrics();
      if (result.error) throw new Error(result.error);
      return result.data!;
    },
    refetchInterval: 60 * 1000, // Atualiza a cada 1 minuto
  });
}
