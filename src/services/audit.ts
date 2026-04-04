import { supabase } from '@/lib/supabase';

/**
 * Insere um registro de auditoria.
 */
export async function insertLog(
  action: string,
  patientId?: string | null,
  payload?: Record<string, unknown>
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action,
      patient_id: patientId || null,
      payload: payload || null,
    });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao registrar log de auditoria.' };
  }
}

/**
 * Busca logs de auditoria com filtros opcionais.
 */
export async function getLogs(filters?: {
  patientId?: string;
  action?: string;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }
    if (filters?.action) {
      query = query.eq('action', filters.action);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar logs.' };
  }
}
