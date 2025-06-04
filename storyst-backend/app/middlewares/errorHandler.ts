import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.';
        error = new ApiError(statusCode, message);
    }

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        ...(error.errors && { errors: error.errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

export default errorHandler;