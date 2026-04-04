import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { formatCurrency, formatDate, maskCPF } from '@/utils/formatters';

export function Dashboard() {
  const BONUS_MENSAL = 400;
  const { data: metricas, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="ml-3 text-slate-500">Carregando métricas...</span>
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-slate-500">Erro ao carregar métricas do dashboard.</p>
        <p className="text-sm text-slate-400">{error?.message}</p>
      </div>
    );
  }

  const alertaCusto = metricas.custoPlanosAtivos > BONUS_MENSAL;

  const cards = [
    {
      titulo: 'Bônus Mensal',
      valor: formatCurrency(BONUS_MENSAL),
      icone: DollarSign,
      cor: 'bg-blue-500',
      subtitulo: 'Valor fixo',
    },
    {
      titulo: 'Custo Planos Ativos',
      valor: formatCurrency(metricas.custoPlanosAtivos),
      icone: TrendingDown,
      cor: 'bg-red-500',
      subtitulo: `${metricas.vidasAtivas} vidas ativas`,
    },
    {
      titulo: 'Saldo do Bônus',
      valor: formatCurrency(metricas.saldoBonus),
      icone: metricas.saldoBonus >= 0 ? TrendingUp : TrendingDown,
      cor: metricas.saldoBonus >= 0 ? 'bg-emerald-500' : 'bg-red-500',
      subtitulo: metricas.saldoBonus >= 0 ? 'Dentro do orçamento' : 'Ultrapassou o limite',
      alerta: metricas.saldoBonus < 0,
    },
    {
      titulo: 'Vidas Ativas',
      valor: metricas.vidasAtivas,
      icone: Users,
      cor: 'bg-emerald-500',
      subtitulo: 'Pacientes com plano ativo',
    },
    {
      titulo: 'Vidas Pendentes',
      valor: metricas.vidasPendentes,
      icone: Clock,
      cor: 'bg-amber-500',
      subtitulo: 'Aguardando ativação',
    },
    {
      titulo: 'Custo Projetado',
      valor: formatCurrency(metricas.custoProjetado),
      icone: DollarSign,
      cor: 'bg-purple-500',
      subtitulo: 'Se todos forem ativados',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Visão geral da operação</p>
        </div>
      </div>

      {/* Alerta de custo */}
      {alertaCusto && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            Atenção: O custo dos planos ativos ({formatCurrency(metricas.custoPlanosAtivos)})
            ultrapassou o bônus mensal de {formatCurrency(BONUS_MENSAL)}!
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className={card.alerta ? 'border-red-300' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.titulo}</p>
                  <p
                    className={`text-2xl font-bold mt-2 ${
                      card.alerta ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {card.valor}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{card.subtitulo}</p>
                </div>
                <div
                  className={`w-12 h-12 ${card.cor} rounded-lg flex items-center justify-center`}
                >
                  <card.icone className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Evolução (Histórico 6 Meses) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Evolução de Pacientes Ativos (6 Meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.historico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-sm">
                          <p className="font-medium text-slate-900">{data.mes}</p>
                          <p className="text-emerald-600 font-bold">
                            {data.vidas} Vidas
                          </p>
                          <p className="text-slate-500 text-sm">
                            Custo: {formatCurrency(data.custo)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                   dataKey="vidas" 
                   fill="#10b981" 
                   radius={[4, 4, 0, 0]} 
                   barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pacientes com plano vencendo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Planos Vencendo em 7 Dias</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              {metricas.pacientesVencendo.length} paciente(s) encontrado(s)
            </p>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3 mr-1" />
            Urgente
          </Badge>
        </CardHeader>
        <CardContent>
          {metricas.pacientesVencendo.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Nenhum plano vencendo nos próximos 7 dias</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metricas.pacientesVencendo.map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{paciente.nome}</p>
                    <p className="text-sm text-slate-500">
                      {maskCPF(paciente.cpf)} • Vence em{' '}
                      {formatDate(paciente.data_expiracao || undefined)}
                    </p>
                  </div>
                  <Link to={`/pacientes/${paciente.id}`}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
