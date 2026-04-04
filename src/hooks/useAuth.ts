import { useAuthStore } from '@/stores/authStore';

/**
 * Hook de conveniência para acessar o estado de autenticação.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const role = useAuthStore((s) => s.role);
  const loading = useAuthStore((s) => s.loading);
  const initialized = useAuthStore((s) => s.initialized);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const loadSession = useAuthStore((s) => s.loadSession);

  const isAdmin = role === 'admin';
  const isOperadora = role === 'operadora';
  const isViewer = role === 'viewer';
  const isAuthenticated = !!user;

  const canInsertPatients = isAdmin;
  const canUpdatePatients = isAdmin || isOperadora;
  const canExport = isAdmin || isOperadora;

  return {
    user,
    session,
    role,
    loading,
    initialized,
    login,
    logout,
    loadSession,
    isAdmin,
    isOperadora,
    isViewer,
    isAuthenticated,
    canInsertPatients,
    canUpdatePatients,
    canExport,
  };
}
