import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getPendingActivation } from '@/services/patients';
import { hasPassedWorkingHours } from '@/utils/workingHoursCalculator';
import type { Patient, Notificacao } from '@/types';

/**
 * Hook de notificações:
 * - Monitora pacientes com status 'pendente_ativacao' que passaram 48h úteis.
 * - Usa Supabase Realtime para atualizações instantâneas.
 * - Polling a cada 5 minutos como fallback.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [overduePatients, setOverduePatients] = useState<Patient[]>([]);

  const checkOverduePatients = useCallback(async () => {
    const { data: patients } = await getPendingActivation();
    if (!patients) return;

    const overdue = patients.filter((p) => {
      if (!p.data_envio_quality_life) return false;
      return hasPassedWorkingHours(
        new Date(p.data_envio_quality_life),
        48
      );
    });

    setOverduePatients(overdue);

    const notifs: Notificacao[] = overdue.map((p) => ({
      id: `overdue-${p.id}`,
      titulo: '⏰ Prazo de ativação vencido',
      mensagem: `${p.nome} - enviado há mais de 48h úteis e ainda não foi ativado.`,
      data: p.data_envio_quality_life!,
      lida: false,
      patientId: p.id,
    }));

    setNotifications(notifs);
  }, []);

  useEffect(() => {
    // Check imediato
    checkOverduePatients();

    // Polling a cada 5 minutos
    const interval = setInterval(checkOverduePatients, 5 * 60 * 1000);

    // Supabase Realtime
    const channel = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
        },
        () => {
          // Re-check quando qualquer paciente é modificado
          checkOverduePatients();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [checkOverduePatients]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.lida).length;

  return {
    notifications,
    overduePatients,
    unreadCount,
    markAsRead,
    refresh: checkOverduePatients,
  };
}
