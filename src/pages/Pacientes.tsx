import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  Edit2,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { pacientes } from '@/data/mock';
import type { StatusPaciente } from '@/types';
import { formatCurrency, formatDate, maskCPF } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const statusConfig: Record<StatusPaciente, { cor: string; bg: string }> = {
  'PRÉ-CADASTRO': { cor: 'text-amber-700', bg: 'bg-amber-100' },
  'INCOMPLETO': { cor: 'text-red-700', bg: 'bg-red-100' },
  'COMPLETO': { cor: 'text-blue-700', bg: 'bg-blue-100' },
  'PENDENTE ATIVAÇÃO': { cor: 'text-orange-700', bg: 'bg-orange-100' },
  'ATIVO': { cor: 'text-emerald-700', bg: 'bg-emerald-100' },
  'VENCIDO': { cor: 'text-slate-700', bg: 'bg-slate-100' },
  'CANCELADO': { cor: 'text-slate-100', bg: 'bg-slate-700' },
};

const statusOptions: StatusPaciente[] = [
  'PRÉ-CADASTRO',
  'INCOMPLETO',
  'COMPLETO',
  'PENDENTE ATIVAÇÃO',
  'ATIVO',
  'VENCIDO',
  'CANCELADO',
];

export function Pacientes() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusPaciente | 'todos'>('todos');
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((paciente) => {
      const matchBusca = paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        paciente.cpf.includes(busca);
      const matchStatus = filtroStatus === 'todos' || paciente.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [busca, filtroStatus]);

  const toggleSelecionarTodos = () => {
    if (selecionados.size === pacientesFiltrados.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(pacientesFiltrados.map(p => p.id)));
    }
  };

  const toggleSelecionar = (id: string) => {
    const novo = new Set(selecionados);
    if (novo.has(id)) {
      novo.delete(id);
    } else {
      novo.add(id);
    }
    setSelecionados(novo);
  };

  const handleExportar = () => {
    const selecionadosArray = pacientes.filter(p => selecionados.has(p.id));
    const csv = [
      ['Nome', 'CPF', 'Celular', 'Status', 'Plano', 'Valor', 'Data Cadastro'].join(';'),
      ...selecionadosArray.map(p => [
        p.nome,
        p.cpf,
        p.celular,
        p.status,
        p.plano?.tipo || '-',
        p.plano?.valor?.toString().replace('.', ',') || '-',
        formatDate(p.dataCadastro),
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pacientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const limparSelecao = () => {
    setSelecionados(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500">Gerencie os pacientes da franquia</p>
        </div>
        <Link to="/pacientes/novo">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
        </Link>
      </div>

      {/* Barra de seleção */}
      {selecionados.size > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-emerald-900">
                {selecionados.size} paciente(s) selecionado(s)
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={limparSelecao}
                className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportar}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Planilha
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select 
            value={filtroStatus} 
            onValueChange={(v) => setFiltroStatus(v as StatusPaciente | 'todos')}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        pacientesFiltrados.length > 0 && 
                        selecionados.size === pacientesFiltrados.length
                      }
                      onCheckedChange={toggleSelecionarTodos}
                    />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>Nenhum paciente encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros de busca</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pacientesFiltrados.map((paciente) => (
                    <TableRow 
                      key={paciente.id}
                      className={cn(
                        selecionados.has(paciente.id) && 'bg-emerald-50'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selecionados.has(paciente.id)}
                          onCheckedChange={() => toggleSelecionar(paciente.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{paciente.nome}</TableCell>
                      <TableCell className="text-slate-600">
                        {maskCPF(paciente.cpf)}
                      </TableCell>
                      <TableCell className="text-slate-600">{paciente.celular}</TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            statusConfig[paciente.status].bg,
                            statusConfig[paciente.status].cor,
                            'font-medium'
                          )}
                        >
                          {paciente.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {paciente.plano?.tipo || '-'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {paciente.plano?.valor ? formatCurrency(paciente.plano.valor) : '-'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(paciente.dataCadastro)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link to={`/pacientes/${paciente.id}`}>
                              <DropdownMenuItem>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Contador */}
      <div className="text-sm text-slate-500 text-center">
        Mostrando {pacientesFiltrados.length} de {pacientes.length} pacientes
      </div>
    </div>
  );
}
