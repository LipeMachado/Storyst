import { Request, Response } from 'express';
import prisma from '../config/prisma';
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
        return res.status(404).json({
            status: 'fail',
            message: 'Nenhum cliente encontrado.'
        });
    }

    return res.status(200).json({
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

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return res.status(404).json({
            status: 'fail',
            message: 'Cliente não encontrado.'
        });
    }

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
        return res.status(404).json({
            status: 'fail',
            message: 'Cliente não encontrado.'
        });
    }

    return res.status(200).json({
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
        return res.status(400).json({
            status: 'fail',
            message: 'Dados de atualização inválidos.',
            errors
        });
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

    return res.status(200).json({
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

    const customerToDelete = await prisma.customer.findUnique({ 
        where: { id } 
    });
    if (!customerToDelete) {
        return res.status(404).json({
            status: 'fail',
            message: 'Cliente não encontrado para exclusão.'
        });
    }

    await prisma.customer.delete({
        where: { id },
    });

    return res.status(204).json({
        status: 'success',
        message: 'Cliente excluído com sucesso.',
    });
});