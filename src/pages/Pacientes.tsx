import { useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search,
  Plus,
  Filter,
  Download,
  FileText,
  Edit2,
  MoreHorizontal,
  X,
  Loader2,
  CheckCircle,
  Trash,
  XCircle,
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
import { useCancelPatient, useDeletePatient } from '@/hooks/useMutatePatient';
import type { StatusPaciente } from '@/types';
import { STATUS_LABELS, STATUS_CONFIG, STATUS_OPTIONS } from '@/types';
import { formatCurrency, formatDate, maskCPF } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Pacientes() {
  const { canInsertPatients, canUpdatePatients, canExport, isAdmin } = useAuth();

  const cancelMutation = useCancelPatient();
  const deleteMutation = useDeletePatient();

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
    const ids = selecionados.size > 0 
      ? Array.from(selecionados) 
      : pacientesFiltrados.map((p) => p.id);

    if (ids.length === 0) {
      toast.error('Nenhum paciente para exportar.');
      setExportando(false);
      return;
    }
    
    const { error } = await exportPlanilhaQualityLife(ids);
    setExportando(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Planilha Exportada! Abrindo WhatsApp...');
      setSelecionados(new Set());
      
      const msg = encodeURIComponent("Olá Quality Life, seguem em anexo as novas vidas a serem ativadas na telemedicina.");
      setTimeout(() => {
        window.open(`https://wa.me/5511966713984?text=${msg}`, '_blank');
      }, 1000);
    }
  };

  const handleExportarPDF = () => {
    const pacientesExport = selecionados.size > 0 
      ? pacientesFiltrados.filter(p => selecionados.has(p.id))
      : pacientesFiltrados;

    if (pacientesExport.length === 0) {
      toast.error('Nenhum paciente para exportar.');
      return;
    }
    
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.text('Relatório de Pacientes - Quality Life', 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    const tableColumn = ["Nome", "CPF", "Status", "Plano", "Data de Cadastro", "Valor"];
    const tableRows = pacientesExport.map(p => [
      p.nome,
      maskCPF(p.cpf),
      STATUS_LABELS[p.status],
      p.plano || '-',
      formatDate(p.data_inicio_cadastro),
      p.valor_plano ? formatCurrency(p.valor_plano) : '-'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [5, 150, 105] }, // emerald-600
    });

    doc.save(`pacientes_qualitylife_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Relatório em PDF gerado com sucesso!');
  };

  const limparSelecao = () => {
    setSelecionados(new Set());
  };

  // Pacientes selecionados que não estão ativos
  const selectedNotActive = pacientesFiltrados.filter(
    (p) => selecionados.has(p.id) && p.status !== 'ativo'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-slate-500">Gerencie os pacientes da franquia</p>
        </div>
        <div className="flex items-center gap-2">
          {canExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportar}
              disabled={exportando}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 h-10"
            >
              {exportando ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              CSV
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportarPDF}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 h-10"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>

          {canInsertPatients && (
            <Link to="/pacientes/novo">
              <Button className="bg-emerald-600 hover:bg-emerald-700 h-10">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </Link>
          )}
        </div>
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
              {selectedNotActive.length > 0 && canUpdatePatients && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivationModalOpen(true)}
                  className="border-emerald-500 text-emerald-700 hover:bg-emerald-100"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Ativação ({selectedNotActive.length})
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
                          {paciente.usa_bonus !== false && (
                            <Badge variant="outline" className="ml-2 border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px]">
                              Bônus
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {paciente.valor_plano
                            ? formatCurrency(paciente.valor_plano)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div>
                            {formatDate(paciente.data_inicio_cadastro)}
                          </div>
                          {paciente.status === 'ativo' && paciente.data_expiracao && (
                            <div className="text-xs text-amber-600 font-medium mt-1">
                              Vence: {formatDate(paciente.data_expiracao)}
                            </div>
                          )}
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
                                {paciente.status !== 'ativo' && paciente.status !== 'cancelado' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setActivationModalOpen(true);
                                      setSelecionados(new Set([paciente.id]));
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                                    Ativar Paciente
                                  </DropdownMenuItem>
                                )}
                                {paciente.status === 'ativo' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (confirm('Deseja realmente cancelar o plano deste paciente? Ele ficará CANCELADO.')) {
                                        cancelMutation.mutateAsync(paciente.id);
                                      }
                                    }}
                                    className="text-amber-600 focus:text-amber-600"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancelar Plano
                                  </DropdownMenuItem>
                                )}
                                {isAdmin && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (confirm('Deseja EXCLUIR DEFINITIVAMENTE este usuário? Esta ação não tem volta.')) {
                                        deleteMutation.mutateAsync(paciente.id);
                                      }
                                    }}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Excluir Usuário
                                  </DropdownMenuItem>
                                )}
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
        patients={selectedNotActive.length > 0 ? selectedNotActive : pacientesFiltrados.filter(p => selecionados.has(p.id))}
      />
    </div>
  );
}
