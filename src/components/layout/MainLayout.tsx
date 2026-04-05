import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
