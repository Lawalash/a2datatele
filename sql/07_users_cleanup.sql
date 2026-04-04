-- =========================================================================
-- UPDATE SCRIPT - Atualização e Limpeza de Usuários e Perfis
-- =========================================================================

-- 1. Renomear o seu usuário atual para "Ricardo Alexandre"
UPDATE public.user_profiles
SET nome = 'Ricardo Alexandre'
WHERE id = 'f70c1bae-1a88-4e25-81da-0d48af3bc547';

-- 2. Excluir os 3 usuários antigos da tabela de perfis de interface
DELETE FROM public.user_profiles
WHERE id IN (
  '170a3fdc-7b9a-471b-a3c2-9b94842de92d',
  '710130c6-49cc-45d5-a518-a8b1700d903c',
  'c92ce70a-a678-45eb-9368-b3b5760ba379'
);

-- 3. (Opcional) Excluir os 3 usuários antigos da base de Autenticação do Supabase
-- Somente execute esta parte se você tiver certeza absoluta de que não precisa mais desses logins,
-- e se eles não estiverem amarrados a NENHUM auditor(log_ativo) que você não deletou em cascata ainda!
-- Na dúvida, se não executar esse trecho abaixo, eles não conseguirão mais logar na plataforma de qualquer jeito, 
-- pois perderam seus roles na tabela acima!
DELETE FROM auth.users
WHERE id IN (
  '170a3fdc-7b9a-471b-a3c2-9b94842de92d',
  '710130c6-49cc-45d5-a518-a8b1700d903c',
  'c92ce70a-a678-45eb-9368-b3b5760ba379'
);
