import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  MoreHorizontal,
  X,
  Loader2,
  CheckCircle,
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
import { usePatients } from '@/hooks/usePatients';
import { useAuth } from '@/hooks/useAuth';
import { exportPlanilhaQualityLife } from '@/services/export';
import { ActivationModal } from '@/components/ActivationModal';
import type { StatusPaciente } from '@/types';
import { STATUS_LABELS, STATUS_CONFIG, STATUS_OPTIONS } from '@/types';
import { formatCurrency, formatDate, maskCPF } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Pacientes() {
  const { canInsertPatients, canUpdatePatients, canExport } = useAuth();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusPaciente | 'todos'>('todos');
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [exportando, setExportando] = useState(false);
  const [activationModalOpen, setActivationModalOpen] = useState(false);

  // Debounce de busca com query key
  const { data, isLoading, error } = usePatients({
    search: busca || undefined,
    status: filtroStatus,
  });

  const pacientesFiltrados = data?.patients ?? [];

  const toggleSelecionarTodos = () => {
    if (selecionados.size === pacientesFiltrados.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(pacientesFiltrados.map((p) => p.id)));
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

  const handleExportar = async () => {
    if (!canExport) {
      toast.error('Você não tem permissão para exportar.');
      return;
    }

    setExportando(true);
    const ids = Array.from(selecionados);
    const { error } = await exportPlanilhaQualityLife(ids);
    setExportando(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Planilha exportada com sucesso!');
      setSelecionados(new Set());
    }
  };

  const limparSelecao = () => {
    setSelecionados(new Set());
  };

  // Pacientes selecionados que estão pendentes de ativação
  const selectedPendentes = pacientesFiltrados.filter(
    (p) => selecionados.has(p.id) && p.status === 'pendente_ativacao'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500">Gerencie os pacientes da franquia</p>
        </div>
        {canInsertPatients && (
          <Link to="/pacientes/novo">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        )}
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
            <div className="flex items-center gap-2">
              {selectedPendentes.length > 0 && canUpdatePatients && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivationModalOpen(true)}
                  className="border-emerald-500 text-emerald-700 hover:bg-emerald-100"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Ativação ({selectedPendentes.length})
                </Button>
              )}
              {canExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportar}
                  disabled={exportando}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  {exportando ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar Planilha
                </Button>
              )}
            </div>
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
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              <span className="ml-3 text-slate-500">Carregando pacientes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Erro ao carregar pacientes: {error.message}
            </div>
          ) : (
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
                              STATUS_CONFIG[paciente.status].bg,
                              STATUS_CONFIG[paciente.status].cor,
                              'font-medium'
                            )}
                          >
                            {STATUS_LABELS[paciente.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {paciente.plano || '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {paciente.valor_plano
                            ? formatCurrency(paciente.valor_plano)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {formatDate(paciente.data_inicio_cadastro)}
                        </TableCell>
                        <TableCell>
                          {canUpdatePatients && (
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
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contador */}
      <div className="text-sm text-slate-500 text-center">
        Mostrando {pacientesFiltrados.length} de {data?.count ?? 0} pacientes
      </div>

      {/* Modal de Ativação */}
      <ActivationModal
        open={activationModalOpen}
        onClose={() => {
          setActivationModalOpen(false);
          setSelecionados(new Set());
        }}
        patients={selectedPendentes}
      />
    </div>
  );
}
