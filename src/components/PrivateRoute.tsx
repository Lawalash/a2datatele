import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * Componente de rota protegida.
 * - Se não autenticado → redireciona para /login
 * - Se role insuficiente → redireciona para /unauthorized
 */
export function PrivateRoute({ children, requiredRoles }: PrivateRouteProps) {
  const { isAuthenticated, role, loading, initialized } = useAuth();

  // Enquanto carrega a sessão, mostra loading
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="w-8 h-8 text-emerald-600" />
          <p className="text-slate-500 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar role exigida
  if (requiredRoles && role && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
