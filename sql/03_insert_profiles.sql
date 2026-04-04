-- =========================================================================
-- SCRIPT DE INSERÇÃO - Popular 'user_profiles' caso esteja vazio
-- =========================================================================

-- Inserir o perfil Admin (Fernando)
INSERT INTO public.user_profiles (id, nome, role)
SELECT id, 'Fernando Marinho', 'admin'
FROM auth.users
WHERE email = 'fernando@qualitylife.com.br'
ON CONFLICT (id) DO UPDATE SET role = 'admin', nome = 'Fernando Marinho';

-- Inserir o perfil Operadora
INSERT INTO public.user_profiles (id, nome, role)
SELECT id, 'Operadora Quality Life', 'operadora'
FROM auth.users
WHERE email = 'operadora@qualitylife.com.br'
ON CONFLICT (id) DO UPDATE SET role = 'operadora', nome = 'Operadora Quality Life';

-- Inserir o perfil Admin (Edson)
INSERT INTO public.user_profiles (id, nome, role)
SELECT id, 'Edson', 'admin'
FROM auth.users
WHERE email = 'edson@qualitylife.com.br'
ON CONFLICT (id) DO UPDATE SET role = 'admin', nome = 'Edson';

-- =========================================================================
-- TRIGGER OPCIONAL - Para novos usuários no futuro
-- (Certifica que qualquer novo cadastro crie a linha em user_profiles)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nome, role)
  VALUES (new.id, split_part(new.email, '@', 1), 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
