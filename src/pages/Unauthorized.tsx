import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Acesso Não Autorizado</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Você não tem permissão para acessar esta página. 
          Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <Link to="/dashboard">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
