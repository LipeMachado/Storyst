import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../middlewares/auth';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

import {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
} from '../controllers/customerController';

const router = Router();

router.get('/dashboard', authMiddleware, catchAsync(async (req: Request, res: Response) => {
    if (!req.customer || !req.customer.customerId) {
        throw new ApiError(401, 'Usuário não autenticado ou cliente não encontrado nas credenciais do token.');
    }

    const customer = await prisma.customer.findUnique({
        where: { id: req.customer.customerId },
        select: {
            id: true,
            name: true,
            email: true,
            birth_date: true,
            created_at: true,
            updated_at: true,
        },
    });

    if (!customer) {
        throw new ApiError(404, 'Cliente não encontrado no banco de dados.');
    }

    res.status(200).json({
        message: 'Perfil do cliente obtido com sucesso.',
        customer: customer,
    });
}));

router.get('/', authMiddleware, getAllCustomers);

// GET /api/customers/:id - Get a single client(customer) by ID
router.get('/:id', authMiddleware, getCustomerById);

// PUT /api/customers/:id - Update a client(customer) by ID
router.put('/:id', authMiddleware, updateCustomer);

// DELETE /api/customers/:id - Remove a client(customer) by ID
router.delete('/:id', authMiddleware, deleteCustomer);

export default router;