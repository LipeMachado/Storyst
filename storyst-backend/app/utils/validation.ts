export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  
  return emailRegex.test(email);
}

export function isValidDateFormat(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDayOfMonth) {
    return false;
  }
  
  return true;
}