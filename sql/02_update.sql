-- =========================================================================
-- UPDATE SCRIPT - Correção de Permissões, Realtime e Atualização de Acessos
-- =========================================================================

-- 1. Forçar a publicação da tabela patients para Realtime (Notificações instantâneas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'patients'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE patients;
  END IF;
END $$;

-- 2. Atualizar as contas existentes para suas devidas Roles
UPDATE user_profiles
SET role = 'admin', nome = 'Fernando Marinho'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'fernando@qualitylife.com.br');

UPDATE user_profiles
SET role = 'operadora', nome = 'Operadora Quality Life'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'operadora@qualitylife.com.br');

UPDATE user_profiles
SET nome = 'Edson'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'edson@qualitylife.com.br');

-- 3. Alterar as Políticas RLS (Row Level Security) para permitir que admin, operadora e viewer criem pacientes
DROP POLICY IF EXISTS "admin_insert_patients" ON patients;

CREATE POLICY "everyone_insert_patients"
  ON patients FOR INSERT
  WITH CHECK (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'operadora', 'viewer')
  );

-- Opcional: Permitir que operadora e viewer editem também?
-- Como a regra "admin_operadora_update_patients" já permite que a operadora e admin atualizem, o viewer fica apenas com a permissão de criar e visualizar (ou atualizar caso também precise, aqui mantemos apenas create para o viewer, mas como pediram inserção, o insert foi adaptado).
