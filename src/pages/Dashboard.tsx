import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  ArrowRight,
  DollarSign,

  Activity,
  Shield,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { formatCurrency, formatDate, maskCPF } from '@/utils/formatters';

const PIE_COLORS = ['#0d2f52', '#4e7fa6', '#7aadc8', '#a8cfe0'];

export function Dashboard() {
  const BONUS_MENSAL = 400;
  const { data: metricas, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d2f52] to-[#4e7fa6] flex items-center justify-center shadow-xl animate-pulse">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <p className="mt-4 text-[#4e7fa6] font-medium">Carregando métricas...</p>
        <p className="text-xs text-slate-400 mt-1">Atualizando dados em tempo real</p>
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-[#0d2f52] font-semibold text-lg">Erro ao carregar métricas</p>
        <p className="text-sm text-slate-400 mt-1">{error?.message}</p>
      </div>
    );
  }

  const alertaCusto = metricas.custoPlanosAtivos > BONUS_MENSAL;
  const percentualOcupado = Math.min(
    (metricas.custoPlanosAtivos / BONUS_MENSAL) * 100,
    100
  );
  const totalVidas = metricas.vidasAtivas + metricas.vidasPendentes;

  // Pie data for status distribution
  const pieData = [
    { name: 'Ativas', value: metricas.vidasAtivas },
    { name: 'Pendentes', value: metricas.vidasPendentes },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d2f52] tracking-tight">Dashboard</h1>
          <p className="text-[#4e7fa6] text-sm mt-0.5">
            Visão geral da operação • Atualizado em tempo real
          </p>
        </div>
        <Badge
          variant="outline"
          className="hidden sm:flex items-center gap-1.5 border-[#7aadc8]/30 text-[#4e7fa6] bg-[#7aadc8]/10 font-medium px-3 py-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7aadc8] animate-pulse-dot" />
          Live
        </Badge>
      </div>

      {/* ── Alert ── */}
      {alertaCusto && (
        <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertDescription className="text-red-800 font-medium">
            <span className="font-bold">Atenção:</span> O custo dos planos ativos (
            {formatCurrency(metricas.custoPlanosAtivos)}) ultrapassou o bônus mensal de{' '}
            {formatCurrency(BONUS_MENSAL)}!
          </AlertDescription>
        </Alert>
      )}

      {/* ── KPI Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bônus Mensal */}
        <Card className="card-hover border-0 shadow-md bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0d2f52] to-[#4e7fa6]" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#4e7fa6] uppercase tracking-wider">
                  Bônus Mensal
                </p>
                <p className="text-2xl font-bold text-[#0d2f52] mt-2">
                  {formatCurrency(BONUS_MENSAL)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Valor fixo mensal
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d2f52] to-[#4e7fa6] flex items-center justify-center shadow-lg shadow-[#0d2f52]/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custo Planos Ativos */}
        <Card className="card-hover border-0 shadow-md bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                  Custo Planos Ativos
                </p>
                <p className="text-2xl font-bold text-[#0d2f52] mt-2">
                  {formatCurrency(metricas.custoPlanosAtivos)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                  {metricas.vidasAtivas} vidas ativas
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg shadow-red-400/20">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saldo do Bônus */}
        <Card
          className={`card-hover border-0 shadow-md bg-white overflow-hidden relative ${
            metricas.saldoBonus < 0 ? 'ring-1 ring-red-200' : ''
          }`}
        >
          <div
            className={`absolute top-0 left-0 w-full h-1 ${
              metricas.saldoBonus >= 0
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}
          />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    metricas.saldoBonus >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  Saldo do Bônus
                </p>
                <p
                  className={`text-2xl font-bold mt-2 ${
                    metricas.saldoBonus >= 0 ? 'text-[#0d2f52]' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(metricas.saldoBonus)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  {metricas.saldoBonus >= 0 ? (
                    <>
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      Dentro do orçamento
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      Ultrapassou o limite
                    </>
                  )}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${
                  metricas.saldoBonus >= 0
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-400/20'
                    : 'bg-gradient-to-br from-red-400 to-red-500 shadow-red-400/20'
                }`}
              >
                {metricas.saldoBonus >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vidas Ativas */}
        <Card className="card-hover border-0 shadow-md bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4e7fa6] to-[#7aadc8]" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#4e7fa6] uppercase tracking-wider">
                  Vidas Ativas
                </p>
                <p className="text-2xl font-bold text-[#0d2f52] mt-2">{metricas.vidasAtivas}</p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#7aadc8]" />
                  Pacientes com plano ativo
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4e7fa6] to-[#7aadc8] flex items-center justify-center shadow-lg shadow-[#4e7fa6]/20">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vidas Pendentes */}
        <Card className="card-hover border-0 shadow-md bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Vidas Pendentes
                </p>
                <p className="text-2xl font-bold text-[#0d2f52] mt-2">{metricas.vidasPendentes}</p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  Aguardando ativação
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-400/20">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custo Projetado */}
        <Card className="card-hover border-0 shadow-md bg-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-500" />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Custo Projetado
                </p>
                <p className="text-2xl font-bold text-[#0d2f52] mt-2">
                  {formatCurrency(metricas.custoProjetado)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <Target className="w-3 h-3 text-purple-500" />
                  Se todos forem ativados
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-400/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Budget Progress Bar ── */}
      <Card className="border-0 shadow-md bg-white overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0d2f52]">Consumo do Bônus Mensal</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatCurrency(metricas.custoPlanosAtivos)} de {formatCurrency(BONUS_MENSAL)} utilizados
              </p>
            </div>
            <span
              className={`text-lg font-bold ${
                percentualOcupado >= 100 ? 'text-red-600' : percentualOcupado >= 80 ? 'text-amber-600' : 'text-[#4e7fa6]'
              }`}
            >
              {percentualOcupado.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-3 bg-[#e8eaed] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentualOcupado >= 100
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : percentualOcupado >= 80
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-[#4e7fa6] to-[#7aadc8]'
              }`}
              style={{ width: `${Math.min(percentualOcupado, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-slate-400">0%</span>
            <span className="text-[10px] text-slate-400">50%</span>
            <span className="text-[10px] text-slate-400">100%</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evolução de Vidas — Area Chart */}
        <Card className="border-0 shadow-md bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#0d2f52]">
              <div className="w-8 h-8 rounded-lg bg-[#7aadc8]/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#4e7fa6]" />
              </div>
              <div>
                <span className="text-base font-semibold">Evolução de Pacientes Ativos</span>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Últimos 6 meses</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricas.historico}>
                  <defs>
                    <linearGradient id="vidasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4e7fa6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4e7fa6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eaed" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: '#4e7fa6', fontSize: 12 }}
                    axisLine={{ stroke: '#e8eaed' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#4e7fa6', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: '#7aadc8', strokeDasharray: '4 4' }}
                    content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-[#e8eaed] rounded-xl shadow-lg">
                            <p className="font-semibold text-[#0d2f52] text-sm">{data.mes}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#4e7fa6]" />
                              <p className="text-[#4e7fa6] font-bold text-sm">
                                {data.vidas} Vidas
                              </p>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">
                              Custo: {formatCurrency(data.custo)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="vidas"
                    stroke="#4e7fa6"
                    strokeWidth={2.5}
                    fill="url(#vidasGradient)"
                    dot={{ r: 4, fill: '#0d2f52', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#4e7fa6', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution — Pie Chart */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-[#0d2f52]">
              <div className="w-8 h-8 rounded-lg bg-[#7aadc8]/15 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#4e7fa6]" />
              </div>
              <div>
                <span className="text-base font-semibold">Distribuição</span>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Status das vidas</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-[#e8eaed] rounded-lg shadow-lg text-xs">
                            <p className="font-semibold text-[#0d2f52]">{payload[0].name}</p>
                            <p className="text-[#4e7fa6] font-bold">{payload[0].value} vidas</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-2 mt-2">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0d2f52]">
                    {item.value}{' '}
                    <span className="text-slate-400 font-normal">
                      ({totalVidas > 0 ? ((item.value / totalVidas) * 100).toFixed(0) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Custo por Mês — Bar Chart ── */}
      <Card className="border-0 shadow-md bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-[#0d2f52]">
            <div className="w-8 h-8 rounded-lg bg-[#7aadc8]/15 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#4e7fa6]" />
            </div>
            <div>
              <span className="text-base font-semibold">Custo Mensal por Período</span>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Histórico de gastos com planos
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.historico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eaed" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: '#4e7fa6', fontSize: 12 }}
                  axisLine={{ stroke: '#e8eaed' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#4e7fa6', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <Tooltip
                  cursor={{ fill: '#f0f2f5' }}
                  content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-[#e8eaed] rounded-xl shadow-lg">
                          <p className="font-semibold text-[#0d2f52] text-sm">{data.mes}</p>
                          <p className="text-[#0d2f52] font-bold text-sm mt-1">
                            {formatCurrency(data.custo)}
                          </p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {data.vidas} vidas ativas
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="custo"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                >
                  {metricas.historico.map((_: any, index: number) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={index === metricas.historico.length - 1 ? '#0d2f52' : '#7aadc8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Expiring Plans Table ── */}
      <Card className="border-0 shadow-md bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#e8eaed] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base text-[#0d2f52]">Planos Vencendo em 7 Dias</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                {metricas.pacientesVencendo.length} paciente(s) encontrado(s)
              </p>
            </div>
          </div>
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2.5 py-0.5">
            <Clock className="w-3 h-3 mr-1" />
            Urgente
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {metricas.pacientesVencendo.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-[#e8eaed] flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-medium text-[#0d2f52]">Tudo em dia!</p>
              <p className="text-xs text-slate-400 mt-1">
                Nenhum plano vencendo nos próximos 7 dias
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e8eaed]">
              {metricas.pacientesVencendo.map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f0f2f5] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0d2f52] to-[#4e7fa6] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {paciente.nome
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0d2f52] text-sm">{paciente.nome}</p>
                      <p className="text-xs text-slate-400">
                        {maskCPF(paciente.cpf)} • Vence em{' '}
                        <span className="text-amber-600 font-medium">
                          {formatDate(paciente.data_expiracao || undefined)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Link to={`/pacientes/${paciente.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#4e7fa6] hover:text-[#0d2f52] hover:bg-[#7aadc8]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
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
