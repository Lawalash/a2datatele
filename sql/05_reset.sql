-- Inserir novo admin lvtlawalash1@gmail.com
INSERT INTO public.user_profiles (id, nome, role)
SELECT id, 'Admin Lawalash', 'admin'
FROM auth.users
WHERE email = 'lvtlawalash1@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', nome = 'Admin Lawalash';

-- Limpar a tabela de audit logs e patients (CASCADING se precisar, ou delete natural)
DELETE FROM public.audit_logs;
DELETE FROM public.patients;
