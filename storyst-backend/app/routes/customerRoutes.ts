import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../middlewares/auth';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.get('/dashboard', authMiddleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.customer || !req.customer.customerId) {
        throw new ApiError(401, 'Usuário não autenticado ou cliente não encontrado.');
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
        throw new ApiError(404, 'Cliente não encontrado.');
    }

    res.status(200).json({
        message: 'Perfil do cliente obtido com sucesso.',
        customer: customer,
    });
}));

export default router;