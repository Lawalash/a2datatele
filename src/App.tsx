import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from '@/pages/Login';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Pacientes } from '@/pages/Pacientes';
import { NovoPaciente } from '@/pages/NovoPaciente';
import { EditarPaciente } from '@/pages/EditarPaciente';
import { Configuracoes } from '@/pages/Configuracoes';

function App() {
  return (
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
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas com layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="pacientes/novo" element={<NovoPaciente />} />
          <Route path="pacientes/:id" element={<EditarPaciente />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
        
        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
