import DOMPurify from 'dompurify';

/**
 * Sanitiza texto para prevenir XSS.
 * Remove tags HTML e scripts maliciosos.
 */
export function sanitize(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitiza todos os campos de texto de um objeto.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitize(value);
    }
  }
  return sanitized;
}
