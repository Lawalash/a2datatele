import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProfiles, updateProfileName, updateProfileRole, verifyAndUpdatePassword } from '@/services/auth';
import { toast } from 'sonner';

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await getAllProfiles();
      if (error) throw new Error(error);
      return data;
    },
  });
}

export function useUpdateProfileName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, nome }: { userId: string; nome: string }) => {
      const { error } = await updateProfileName(userId, nome);
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      toast.success('Nome atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar nome.');
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, role }: { profileId: string; role: string }) => {
      const { error } = await updateProfileRole(profileId, role);
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      toast.success('Função atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar função.');
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ email, oldPassword, newPassword }: { email: string; oldPassword: string; newPassword: string }) => {
      const { error } = await verifyAndUpdatePassword(email, oldPassword, newPassword);
      if (error) throw new Error(error);
      return true;
    },
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso! Faça login novamente com a nova senha.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao redefinir a senha.');
    },
  });
}
