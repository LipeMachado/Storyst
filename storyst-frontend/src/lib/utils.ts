import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  try {
    if (dateString === '[object Object]' || 
        (typeof dateString === 'object' && dateString !== null)) {
      return 'N/A';
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

export function findFirstMissingLetter(name: string): string {
  if (!name) return 'a';
  
  const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  const presentLetters = new Set(normalizedName.split(''));
  
  for (let charCode = 97; charCode <= 122; charCode++) {
    const letter = String.fromCharCode(charCode);
    if (!presentLetters.has(letter)) {
      return letter;
    }
  }
  
  return '-';
}
