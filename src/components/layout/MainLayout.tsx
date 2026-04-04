import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { usuarioAtual, notificacoes as notificacoesIniciais } from '@/data/mock';

export function MainLayout() {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais);

  const handleMarcarLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const handleLogout = () => {
    // Lógica de logout pode ser adicionada aqui
    console.log('Logout realizado');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="ml-64">
        <Header 
          usuario={usuarioAtual} 
          notificacoes={notificacoes}
          onMarcarLida={handleMarcarLida}
        />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
