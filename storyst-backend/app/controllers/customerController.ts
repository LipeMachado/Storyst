import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { updateCustomerSchema } from '../schemas/customerSchemas';

// Get /api/customers - List all clients(customers)
export const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birth_date: true,
        created_at: true,
        updated_at: true
      } 
    })

    if (!customers) {
        throw new ApiError(404, 'Nenhum cliente encontrado.');
    }

    res.status(200).json({
        status: 'success',
        results: customers.length,
        data: {
            customers
        }
    });
})

// GET /api/customers/:id - Get a single client(customer) by ID
export const getCustomerById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
        where: { id },
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
        status: 'success',
        data: {
            customer,
        },
    });
});

// PUT /api/customers/:id - Update a client(customer) by ID
export const updateCustomer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const validationResult = updateCustomerSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        throw new ApiError(400, 'Dados de atualização inválidos.', errors);
    }

    const { name, email, birth_date } = validationResult.data;

    const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
            name: name,
            email: email,
            birth_date: birth_date ? new Date(birth_date) : undefined,
            updated_at: new Date(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            birth_date: true,
            created_at: true,
            updated_at: true,
        },
    });

    res.status(200).json({
        status: 'success',
        message: 'Cliente atualizado com sucesso.',
        data: {
            customer: updatedCustomer,
        },
    });
});

// DELETE /api/customers/:id - Remove a client(customer) by ID
export const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const customerToDelete = await prisma.customer.findUnique({ where: { id } });
    if (!customerToDelete) {
        throw new ApiError(404, 'Cliente não encontrado para exclusão.');
    }

    await prisma.customer.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        message: 'Cliente excluído com sucesso.',
    });
});