import catchAsync from '../../../app/utils/catchAsync';
import { Request, Response, NextFunction } from 'express';

describe('catchAsync', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should resolve and execute the function when no error occurs', async () => {
    const mockFunction = jest.fn().mockResolvedValue({ data: 'success' });
    const wrappedFunction = catchAsync(mockFunction);

    await wrappedFunction(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockFunction).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should catch errors and pass them to next function', async () => {
    const error = new Error('Test error');
    const mockFunction = jest.fn().mockRejectedValue(error);
    const wrappedFunction = catchAsync(mockFunction);

    await wrappedFunction(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockFunction).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalledWith(error);
  });
});