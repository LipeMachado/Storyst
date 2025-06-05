import ApiError from '../../../app/utils/ApiError';

describe('ApiError', () => {
  it('should create an operational error with correct properties', () => {
    const statusCode = 400;
    const message = 'Bad Request';
    const errors = [{ field: 'email', message: 'Email inválido' }];
    
    const error = new ApiError(statusCode, message, errors);
    
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.errors).toEqual(errors);
  });

  it('should set status to "error" for 5xx status codes', () => {
    const error = new ApiError(500, 'Internal Server Error');
    
    expect(error.status).toBe('error');
  });
});