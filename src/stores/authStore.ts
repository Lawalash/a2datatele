import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { getCurrentUserProfile } from '@/services/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  profile: { nome: string | null } | null;
  loading: boolean;
  initialized: boolean;
  mfaRequired: boolean;

  login: (email: string, password: string) => Promise<{ error: string | null }>;
  verifyMfa: (code: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  profile: null,
  loading: true,
  initialized: false,
  mfaRequired: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      return { error: error.message };
    }

    const user = data.user;
    const session = data.session;
    let role: UserRole = 'viewer';
    let profile = null;

    if (user) {
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const needsMfa = mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1';
      
      if (needsMfa) {
        set({ user, session, loading: false, mfaRequired: true, initialized: true });
        return { error: 'MFA_REQUIRED' };
      }

      const { data: profileData } = await getCurrentUserProfile(user.id);
      if (profileData) {
        profile = profileData;
        role = profileData.role as UserRole;
      }
    }

    set({ user, session, role, profile, loading: false, initialized: true });
    return { error: null };
  },

  verifyMfa: async (code: string) => {
    set({ loading: true });
    try {
      const factors = await supabase.auth.mfa.listFactors();
      const totpFactor = factors.data?.totp.find(f => f.status === 'verified');
      if (!totpFactor) return { error: 'Nenhum fator 2FA encontrado.' };

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code
      });

      if (error) return { error: error.message };

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await getCurrentUserProfile(session.user.id);
        const role = profileData?.role as UserRole ?? 'viewer';
        set({
          user: session.user,
          session,
          role,
          profile: profileData,
          loading: false,
          initialized: true,
          mfaRequired: false,
        });
      }
      return { error: null };
    } catch {
      set({ loading: false });
      return { error: 'Erro ao verificar código MFA.' };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null, profile: null, loading: false, mfaRequired: false });
  },

  loadSession: async () => {
    set({ loading: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const needsMfa = mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1';

      const { data: profileData } = await getCurrentUserProfile(session.user.id);

      set({
        user: session.user,
        session,
        role: profileData?.role ?? 'viewer',
        profile: profileData,
        loading: false,
        initialized: true,
        mfaRequired: needsMfa,
      });
    } else {
      set({
        user: null,
        session: null,
        role: null,
        profile: null,
        loading: false,
        initialized: true,
        mfaRequired: false,
      });
    }

    // Escutar mudanças de auth
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null, role: null, profile: null, mfaRequired: false });
      } else if (session?.user) {
        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        const needsMfa = mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1';

        const { data: profileData } = await getCurrentUserProfile(session.user.id);
        set({
          user: session.user,
          session,
          role: profileData?.role ?? 'viewer',
          profile: profileData,
          mfaRequired: needsMfa,
        });
      }
    });
  },
}));
