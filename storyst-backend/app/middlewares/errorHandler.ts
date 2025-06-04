import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const sendErrorDev = (err: ApiError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
        stack: err.stack,
    });
};

const sendErrorProd = (err: ApiError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Ocorreu um erro inesperado! Por favor, tente novamente mais tarde.',
        });
    }
};

const handlePrismaError = (err: PrismaClientKnownRequestError) => {
    let message = 'Erro de banco de dados.';
    let statusCode = 500;
    let errors: any[] | undefined = undefined;

    switch (err.code) {
        case 'P2002':
            const field = (err.meta?.target as string[])?.join(', ') || 'campo(s) único(s)';
            message = `O ${field} fornecido já existe. Por favor, use outro valor.`;
            statusCode = 409;
            errors = [{ path: field.split(', '), message: `Valor duplicado para ${field}.` }];
            break;
        case 'P2025':
            message = 'Recurso não encontrado.';
            statusCode = 404;
            errors = [{ path: (err.meta?.modelName as string) || 'recurso', message: err.meta?.cause || 'Registro não encontrado.' }];
            break;
        default:
            message = `Erro de banco de dados: ${err.message.split('\n').pop()}`;
            statusCode = 500;
            break;
    }
    return new ApiError(statusCode, message, errors);
};


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = err;

    if (error instanceof PrismaClientKnownRequestError) {
        error = handlePrismaError(error);
    }

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Ocorreu um erro interno no servidor.';
        error = new ApiError(statusCode, message);
        error.isOperational = false;
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, res);
    }
};

export default errorHandler;