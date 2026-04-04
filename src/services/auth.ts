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

export async function updateProfileName(userId: string, nome: string) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ nome })
      .eq('id', userId);
    
    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro ao atualizar nome do perfil.' };
  }
}

export async function verifyAndUpdatePassword(email: string, oldPassword: string, newPassword: string) {
  try {
    // 1. Verify old password
    const verify = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });
    
    if (verify.error) {
      return { error: 'Senha atual incorreta.' };
    }

    // 2. Update to new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro ao redefinir a senha.' };
  }
}

export async function getAllProfiles() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Erro ao buscar perfis.' };
  }
}

export async function updateProfileRole(profileId: string, role: string) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', profileId);

    if (error) return { error: error.message };
    return { error: null };
  } catch {
    return { error: 'Erro ao atualizar função do usuário.' };
  }
}
