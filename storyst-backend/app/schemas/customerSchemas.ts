import { z } from 'zod';

export const updateCustomerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres.').optional(),
    email: z.string().email('Formato de e-mail inválido.').optional(),
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data de nascimento inválido. Use YYYY-MM-DD.').optional(),
}).strict('Campos não permitidos no corpo da requisição.');