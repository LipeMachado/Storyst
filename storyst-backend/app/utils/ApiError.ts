class ApiError extends Error {
    public statusCode: number;
    public status: 'fail' | 'error';
    public isOperational: boolean;
    public errors?: any[];

    constructor(statusCode: number, message: string, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;