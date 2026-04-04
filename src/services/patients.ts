import { supabase } from '@/lib/supabase';
import type {
  Patient,
  PatientInsert,
  PatientUpdate,
  StatusPaciente,
} from '@/types';


const BONUS_MENSAL = 400;

// ============================================================
// LIST / SEARCH
// ============================================================

export async function getPatients(filters?: {
  search?: string;
  status?: StatusPaciente | 'todos';
  page?: number;
  perPage?: number;
}) {
  try {
    const page = filters?.page ?? 1;
    const perPage = filters?.perPage ?? 50;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .order('data_inicio_cadastro', { ascending: false })
      .range(from, to);

    if (filters?.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      const term = filters.search.replace(/\D/g, '');
      if (term.length >= 3) {
        // Busca por CPF (somente números)
        query = query.or(
          `nome.ilike.%${filters.search}%,cpf.ilike.%${term}%`
        );
      } else {
        query = query.ilike('nome', `%${filters.search}%`);
      }
    }

    const { data, error, count } = await query;
    if (error) return { data: null, count: 0, error: error.message };
    return { data: data as Patient[], count: count ?? 0, error: null };
  } catch {
    return { data: null, count: 0, error: 'Erro ao buscar pacientes.' };
  }
}

// ============================================================
// GET ONE
// ============================================================

export async function getPatient(id: string) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Patient, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar paciente.' };
  }
}

// ============================================================
// CREATE
// ============================================================

export async function createPatient(input: PatientInsert) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('patients')
      .insert({
        nome: input.nome,
        cpf: input.cpf.replace(/\D/g, ''),
        celular: input.celular.replace(/\D/g, ''),
        email: input.email || null,
        diagnostico: input.diagnostico || null,
        tipo_consulta: input.tipo_consulta || null,
        created_by: user?.id,
        status: 'pre_cadastro' as const,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Patient, error: null };
  } catch {
    return { data: null, error: 'Erro ao criar paciente.' };
  }
}

// ============================================================
// UPDATE
// ============================================================

export async function updatePatient(id: string, updates: PatientUpdate) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Patient, error: null };
  } catch {
    return { data: null, error: 'Erro ao atualizar paciente.' };
  }
}

export async function deletePatient(id: string) {
  try {
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro ao excluir paciente.' };
  }
}

export async function cancelPatient(id: string) {
  try {
    const { error } = await supabase
      .from('patients')
      .update({ status: 'cancelado' })
      .eq('id', id);
    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro ao cancelar paciente.' };
  }
}

// ============================================================
// DASHBOARD METRICS
// ============================================================

export async function getDashboardMetrics() {
  try {
    // Buscar todos os pacientes para calcular métricas
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*');

    if (error) return { data: null, error: error.message };

    const allPatients = patients as Patient[];

    const ativos = allPatients.filter((p) => p.status === 'ativo');
    const pendentes = allPatients.filter((p) =>
      ['pre_cadastro', 'incompleto', 'pendente_ativacao'].includes(p.status)
    );

    const custoPlanosAtivos = ativos.reduce(
      (total, p) => total + (p.usa_bonus !== false ? (p.valor_plano || 0) : 0),
      0
    );

    const custoProjetado = allPatients
      .filter((p) =>
        ['pre_cadastro', 'incompleto', 'completo', 'pendente_ativacao'].includes(
          p.status
        )
      )
      .reduce((total, p) => total + (p.usa_bonus !== false ? (p.valor_plano || 29.9) : 0), 0);

    // Pacientes com plano vencendo nos próximos 7 dias
    const hoje = new Date();
    const limite = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const vencendo = ativos.filter((p) => {
      if (!p.data_expiracao) return false;
      const vencimento = new Date(p.data_expiracao);
      return vencimento <= limite && vencimento >= hoje;
    });

    const ultimosMeses = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      
      const filtered = ativos.filter(p => {
        const pd = new Date(p.data_inicio_cadastro);
        return pd <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
      });

      return {
        mes: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d),
        vidas: filtered.length,
        custo: filtered.reduce((acc, p) => acc + (p.valor_plano || 0), 0)
      };
    }).reverse();

    return {
      data: {
        vidasAtivas: ativos.length,
        vidasPendentes: pendentes.length,
        custoPlanosAtivos,
        saldoBonus: BONUS_MENSAL - custoPlanosAtivos,
        custoProjetado,
        pacientesVencendo: vencendo,
        historico: ultimosMeses,
      },
      error: null,
    };
  } catch {
    return { data: null, error: 'Erro ao calcular métricas.' };
  }
}

// ============================================================
// EXPIRING PATIENTS
// ============================================================

export async function getExpiringPatients(days: number = 7) {
  try {
    const hoje = new Date();
    const limite = new Date(hoje.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'ativo')
      .not('data_expiracao', 'is', null)
      .lte('data_expiracao', limite.toISOString())
      .gte('data_expiracao', hoje.toISOString());

    if (error) return { data: null, error: error.message };
    return { data: data as Patient[], error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar pacientes vencendo.' };
  }
}

// ============================================================
// PENDING ACTIVATION (for notifications)
// ============================================================

export async function getPendingActivation() {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'pendente_ativacao')
      .not('data_envio_quality_life', 'is', null);

    if (error) return { data: null, error: error.message };
    return { data: data as Patient[], error: null };
  } catch {
    return {
      data: null,
      error: 'Erro ao buscar pacientes pendentes de ativação.',
    };
  }
}

// ============================================================
// ACTIVATE PATIENTS
// ============================================================

export async function activatePatients(ids: string[]) {
  try {
    const now = new Date();
    const expiration = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('patients')
      .update({
        status: 'ativo',
        data_hora_ativacao: now.toISOString(),
        data_expiracao: expiration.toISOString(),
      })
      .in('id', ids)
      .select();

    if (error) return { data: null, error: error.message };
    return { data: data as Patient[], error: null };
  } catch {
    return { data: null, error: 'Erro ao ativar pacientes.' };
  }
}

// ============================================================
// PRICING PLANS
// ============================================================

export async function getPricingPlans(includeInactive = false) {
  try {
    let query = supabase.from('pricing_plans').select('*').order('nome');
    if (!includeInactive) {
      query = query.eq('ativo', true);
    }
    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar planos.' };
  }
}

export async function createPricingPlan(plan: { nome: string; forma_pagamento: string; valor: number }) {
  try {
    const { data, error } = await supabase.from('pricing_plans').insert(plan).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao criar plano.' };
  }
}

export async function updatePricingPlan(id: string, updates: { nome?: string; forma_pagamento?: string; valor?: number; ativo?: boolean }) {
  try {
    const { data, error } = await supabase.from('pricing_plans').update(updates).eq('id', id).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao atualizar plano.' };
  }
}

export function calcularValorPlano(
  plans: { nome: string; forma_pagamento: string; valor: number }[],
  tipo: string,
  formaPagamento: string
): number {
  const found = plans.find(
    (p) => p.nome === tipo && p.forma_pagamento === formaPagamento
  );
  return found?.valor ?? 0;
}
