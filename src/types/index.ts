// ============================================================
// Database-aligned types (snake_case to match Supabase schema)
// ============================================================

export type StatusPaciente =
  | 'pre_cadastro'
  | 'incompleto'
  | 'completo'
  | 'pendente_ativacao'
  | 'ativo'
  | 'vencido'
  | 'cancelado';

export type TipoConsulta =
  | 'Psicólogo'
  | 'Psiquiatra'
  | 'Clínico Geral'
  | 'Nutricionista'
  | 'Outro';

export type TipoPlano =
  | 'Telemedicina Individual'
  | 'Telemedicina Familiar'
  | 'Tele+Presencial Individual'
  | 'Tele+Presencial Familiar';

export type FormaPagamento = 'Cartão' | 'Boleto';

export type Sexo = 'M' | 'F';

export type UserRole = 'admin' | 'operadora' | 'viewer';

// ============================================================
// Database row types
// ============================================================

export interface Patient {
  id: string;
  created_by: string | null;
  nome: string;
  cpf: string;
  data_nascimento: string | null;
  sexo: Sexo | null;
  celular: string;
  email: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  diagnostico: string | null;
  tipo_consulta: string | null;
  plano: string | null;
  forma_pagamento: string | null;
  funeral: boolean;
  telepsicologia: boolean;
  presencial: boolean;
  status: StatusPaciente;
  usa_bonus: boolean;
  data_inicio_cadastro: string;
  data_envio_quality_life: string | null;
  data_hora_ativacao: string | null;
  data_expiracao: string | null;
  valor_plano: number | null;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  nome: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  patient_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  nome: string;
  forma_pagamento: FormaPagamento;
  valor: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Form / insert types
// ============================================================

export interface PatientInsert {
  nome: string;
  cpf: string;
  celular: string;
  email?: string;
  diagnostico?: string;
  tipo_consulta?: string;
  usa_bonus?: boolean;
}

export interface PatientUpdate {
  data_nascimento?: string | null;
  sexo?: Sexo | null;
  email?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  diagnostico?: string | null;
  tipo_consulta?: string | null;
  plano?: string | null;
  forma_pagamento?: string | null;
  funeral?: boolean;
  telepsicologia?: boolean;
  presencial?: boolean;
  status?: StatusPaciente;
  usa_bonus?: boolean;
  valor_plano?: number | null;
  data_envio_quality_life?: string | null;
  data_hora_ativacao?: string | null;
  data_expiracao?: string | null;
}

// ============================================================
// UI helper types
// ============================================================

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  patientId?: string;
}

export interface MetricaMensal {
  mes: string;
  vidasAtivas: number;
  custoTotal: number;
}

export interface DashboardMetrics {
  vidasAtivas: number;
  vidasPendentes: number;
  custoPlanosAtivos: number;
  saldoBonus: number;
  custoProjetado: number;
  pacientesVencendo: Patient[];
}

// ============================================================
// Status display mapping
// ============================================================

export const STATUS_LABELS: Record<StatusPaciente, string> = {
  pre_cadastro: 'PRÉ-CADASTRO',
  incompleto: 'INCOMPLETO',
  completo: 'COMPLETO',
  pendente_ativacao: 'PENDENTE ATIVAÇÃO',
  ativo: 'ATIVO',
  vencido: 'VENCIDO',
  cancelado: 'CANCELADO',
};

export const STATUS_CONFIG: Record<StatusPaciente, { cor: string; bg: string }> = {
  pre_cadastro: { cor: 'text-amber-700', bg: 'bg-amber-100' },
  incompleto: { cor: 'text-red-700', bg: 'bg-red-100' },
  completo: { cor: 'text-blue-700', bg: 'bg-blue-100' },
  pendente_ativacao: { cor: 'text-orange-700', bg: 'bg-orange-100' },
  ativo: { cor: 'text-emerald-700', bg: 'bg-emerald-100' },
  vencido: { cor: 'text-slate-700', bg: 'bg-slate-100' },
  cancelado: { cor: 'text-slate-100', bg: 'bg-slate-700' },
};

export const STATUS_OPTIONS: StatusPaciente[] = [
  'pre_cadastro',
  'incompleto',
  'completo',
  'pendente_ativacao',
  'ativo',
  'vencido',
  'cancelado',
];
