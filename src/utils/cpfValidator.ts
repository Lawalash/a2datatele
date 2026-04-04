/**
 * Valida CPF usando algoritmo de dígitos verificadores.
 * Aceita CPF com ou sem máscara.
 */
export function validateCPF(cpf: string): boolean {
  // Remove tudo que não é número
  const cleaned = cpf.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (cleaned.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const digits = cleaned.split('').map(Number);

  // Primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = sum % 11;
  const firstVerifier = remainder < 2 ? 0 : 11 - remainder;

  if (digits[9] !== firstVerifier) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = sum % 11;
  const secondVerifier = remainder < 2 ? 0 : 11 - remainder;

  if (digits[10] !== secondVerifier) return false;

  return true;
}

/**
 * Remove a máscara do CPF, retornando só números.
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}
