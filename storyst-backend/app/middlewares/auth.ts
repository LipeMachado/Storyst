import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

declare global {
    namespace Express {
        interface Request {
            customer?: {
                customerId: string;
                email: string;
            };
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET as string

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next(new ApiError(401, 'Token de autenticação não fornecido ou inválido.'));
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { customerId: string; email: string };

        req.customer = decoded;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            next(new ApiError(401, 'Token de autenticação expirado.'));
            return;
        }
        next(new ApiError(401, 'Token de autenticação inválido.'));
        return;
    }
};

export default authMiddleware;