/**
 * Valida se uma string é um email válido
 * @param email String a ser validada
 * @returns true se o email for válido, false caso contrário
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma string está no formato de data YYYY-MM-DD
 * @param dateString String a ser validada
 * @returns true se a data estiver no formato correto, false caso contrário
 */
export function isValidDateFormat(dateString: string): boolean {
  // Verifica o formato YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  // Verifica se a data é válida
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}