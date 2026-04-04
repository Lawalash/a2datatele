import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro inesperado ao fazer login.' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro inesperado ao fazer logout.' };
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return { data: null, error: error.message };
    return { data: data.session, error: null };
  } catch {
    return { data: null, error: 'Erro ao recuperar sessão.' };
  }
}

export async function getCurrentUserRole(userId: string): Promise<{
  data: UserRole | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data.role as UserRole, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar perfil do usuário.' };
  }
}

export async function getCurrentUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar perfil do usuário.' };
  }
}
