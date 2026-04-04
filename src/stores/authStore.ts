import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { getCurrentUserRole } from '@/services/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  initialized: boolean;

  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  loading: true,
  initialized: false,

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

    if (user) {
      const roleResult = await getCurrentUserRole(user.id);
      if (roleResult.data) {
        role = roleResult.data;
      }
    }

    set({ user, session, role, loading: false, initialized: true });
    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null, loading: false });
  },

  loadSession: async () => {
    set({ loading: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const roleResult = await getCurrentUserRole(session.user.id);

      set({
        user: session.user,
        session,
        role: roleResult.data ?? 'viewer',
        loading: false,
        initialized: true,
      });
    } else {
      set({
        user: null,
        session: null,
        role: null,
        loading: false,
        initialized: true,
      });
    }

    // Escutar mudanças de auth
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null, role: null });
      } else if (session?.user) {
        const roleResult = await getCurrentUserRole(session.user.id);
        set({
          user: session.user,
          session,
          role: roleResult.data ?? 'viewer',
        });
      }
    });
  },
}));
