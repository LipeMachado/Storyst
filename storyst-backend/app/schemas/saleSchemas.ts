import { z } from 'zod';

export const createSaleSchema = z.object({
    sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data de venda inválido. Use YYYY-MM-DD.').optional(),
    value: z.number().positive('O valor da venda deve ser um número positivo.'),
}).strict('Campos não permitidos no corpo da requisição.');