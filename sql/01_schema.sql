-- ============================================================
-- Quality Life - Telemedicina - Schema Completo
-- Execute este script inteiro no SQL Editor do Supabase
-- ============================================================

-- ==========================================
-- 1. TABELA: user_profiles
-- ==========================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'operadora', 'viewer')),
  nome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. TABELA: pricing_plans (tabela de preços)
-- ==========================================
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  forma_pagamento TEXT NOT NULL CHECK (forma_pagamento IN ('Cartão', 'Boleto')),
  valor DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nome, forma_pagamento)
);

-- Inserir planos padrão
INSERT INTO pricing_plans (nome, forma_pagamento, valor) VALUES
  ('Telemedicina Individual', 'Cartão', 29.90),
  ('Telemedicina Individual', 'Boleto', 34.90),
  ('Telemedicina Familiar', 'Cartão', 59.90),
  ('Telemedicina Familiar', 'Boleto', 63.90),
  ('Tele+Presencial Individual', 'Cartão', 34.90),
  ('Tele+Presencial Individual', 'Boleto', 37.90),
  ('Tele+Presencial Familiar', 'Cartão', 64.90),
  ('Tele+Presencial Familiar', 'Boleto', 67.90);

-- ==========================================
-- 3. TABELA: patients
-- ==========================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id),
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  data_nascimento DATE,
  sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
  celular TEXT NOT NULL,
  email TEXT,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf CHAR(2),
  diagnostico TEXT,
  tipo_consulta TEXT,
  plano TEXT,
  forma_pagamento TEXT,
  funeral BOOLEAN DEFAULT FALSE,
  telepsicologia BOOLEAN DEFAULT FALSE,
  presencial BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pre_cadastro' CHECK (status IN (
    'pre_cadastro',
    'incompleto',
    'completo',
    'pendente_ativacao',
    'ativo',
    'vencido',
    'cancelado'
  )),
  data_inicio_cadastro TIMESTAMPTZ DEFAULT NOW(),
  data_envio_quality_life TIMESTAMPTZ,
  data_hora_ativacao TIMESTAMPTZ,
  data_expiracao TIMESTAMPTZ,
  valor_plano DECIMAL(10,2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. TABELA: audit_logs
-- ==========================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  patient_id UUID REFERENCES patients(id),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. TRIGGER: Atualizar updated_at automaticamente
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_pricing
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 6. TRIGGER: Criar user_profile ao registrar usuário
-- ==========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, role, nome)
  VALUES (NEW.id, 'viewer', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- 7. VALIDAÇÃO DE CPF VIA TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION validate_cpf(cpf TEXT) RETURNS BOOLEAN AS $$
DECLARE
  digits INT[];
  s1 INT := 0;
  s2 INT := 0;
  r1 INT;
  r2 INT;
  i INT;
BEGIN
  -- CPF deve ter 11 dígitos e não ser sequência repetida
  IF length(cpf) != 11 OR cpf ~ '^(\d)\1+$' THEN
    RETURN FALSE;
  END IF;

  FOR i IN 1..11 LOOP
    digits[i] := substring(cpf, i, 1)::INT;
  END LOOP;

  -- Primeiro dígito verificador
  FOR i IN 1..9 LOOP
    s1 := s1 + digits[i] * (11 - i);
  END LOOP;
  r1 := CASE WHEN s1 % 11 < 2 THEN 0 ELSE 11 - s1 % 11 END;

  -- Segundo dígito verificador
  FOR i IN 1..10 LOOP
    s2 := s2 + digits[i] * (12 - i);
  END LOOP;
  r2 := CASE WHEN s2 % 11 < 2 THEN 0 ELSE 11 - s2 % 11 END;

  RETURN digits[10] = r1 AND digits[11] = r2;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_cpf_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validate_cpf(NEW.cpf) THEN
    RAISE EXCEPTION 'CPF inválido: %', NEW.cpf;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_cpf_trigger
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION check_cpf_before_insert();

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- ---------- user_profiles ----------
-- Cada usuário vê somente o próprio perfil
CREATE POLICY "users_own_profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = id);

-- ---------- patients ----------
-- Todos autenticados podem ler
CREATE POLICY "authenticated_read_patients"
  ON patients FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: apenas admin
CREATE POLICY "admin_insert_patients"
  ON patients FOR INSERT
  WITH CHECK (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- UPDATE: admin e operadora
CREATE POLICY "admin_operadora_update_patients"
  ON patients FOR UPDATE
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'operadora')
  );

-- DELETE: ninguém
CREATE POLICY "no_delete_patients"
  ON patients FOR DELETE
  USING (FALSE);

-- ---------- audit_logs ----------
-- Todos autenticados podem inserir
CREATE POLICY "authenticated_insert_logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Todos autenticados podem ler
CREATE POLICY "authenticated_read_logs"
  ON audit_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Ninguém pode atualizar
CREATE POLICY "no_update_logs"
  ON audit_logs FOR UPDATE
  USING (FALSE);

-- Ninguém pode deletar
CREATE POLICY "no_delete_logs"
  ON audit_logs FOR DELETE
  USING (FALSE);

-- ---------- pricing_plans ----------
-- Todos autenticados podem ler
CREATE POLICY "authenticated_read_pricing"
  ON pricing_plans FOR SELECT
  USING (auth.role() = 'authenticated');

-- Apenas admin pode inserir/atualizar
CREATE POLICY "admin_manage_pricing"
  ON pricing_plans FOR ALL
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );
