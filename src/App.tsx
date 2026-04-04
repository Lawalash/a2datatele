import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Login } from '@/pages/Login';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Pacientes } from '@/pages/Pacientes';
import { Planos } from '@/pages/Planos';
import { NovoPaciente } from '@/pages/NovoPaciente';
import { EditarPaciente } from '@/pages/EditarPaciente';
import { EsqueciSenha } from '@/pages/EsqueciSenha';
import { RedefinirSenha } from '@/pages/RedefinirSenha';
import { Configuracoes } from '@/pages/Configuracoes';
import { Unauthorized } from '@/pages/Unauthorized';
import { PrivateRoute } from '@/components/PrivateRoute';
import { useAuthStore } from '@/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30 segundos
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const loadSession = useAuthStore((s) => s.loadSession);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rotas protegidas com layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pacientes" element={<Pacientes />} />
        <Route
          path="pacientes/novo"
          element={
            <PrivateRoute requiredRoles={['admin', 'operadora', 'viewer']}>
              <NovoPaciente />
            </PrivateRoute>
          }
        />
        <Route
          path="pacientes/:id"
          element={
            <PrivateRoute requiredRoles={['admin', 'operadora']}>
              <EditarPaciente />
            </PrivateRoute>
          }
        />
        <Route
          path="planos"
          element={
            <PrivateRoute requiredRoles={['admin']}>
              <Planos />
            </PrivateRoute>
          }
        />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>

      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'inherit',
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
