-- =========================================================================
-- UPDATE SCRIPT - Liberar Exclusão de Pacientes para o Admin
-- =========================================================================

-- 1. Modificar a restrição de Chave Estrangeira nos logs de auditoria
-- Para permitir que um paciente seja excluído sem o PostgreSQL barrar 
-- por causa de "registros de log antigos associados a ele"
ALTER TABLE audit_logs 
  DROP CONSTRAINT IF EXISTS audit_logs_patient_id_fkey;

ALTER TABLE audit_logs 
  ADD CONSTRAINT audit_logs_patient_id_fkey 
  FOREIGN KEY (patient_id) 
  REFERENCES patients(id) 
  ON DELETE CASCADE;

-- 2. Alterar a Política de Segurança (RLS) da tabela patients
-- Remove a regra "Ninguém pode deletar" que havíamos criado na primeira fase
DROP POLICY IF EXISTS "no_delete_patients" ON patients;

-- Permite explicitamente a exclusão se a Role for 'admin'
CREATE POLICY "admin_delete_patients"
  ON patients FOR DELETE
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );
