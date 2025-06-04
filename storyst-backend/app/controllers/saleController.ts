import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { createSaleSchema } from '../schemas/saleSchemas';

// POST /api/sales - Create a new sale
export const createSale = catchAsync(async (req: Request, res: Response) => {
    const validationResult = createSaleSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
        }));
        throw new ApiError(400, 'Dados de venda inválidos.', errors);
    }

    const { sale_date, value } = validationResult.data;

    if (!req.customer || !req.customer.customerId) {
        throw new ApiError(401, 'ID do cliente não encontrado no token de autenticação.');
    }

    const customerId = req.customer.customerId;

    const newSale = await prisma.sale.create({
        data: {
            customer_id: customerId,
            sale_date: sale_date ? new Date(sale_date) : new Date(),
            value: value,
            created_at: new Date(),
        },
        select: {
            id: true,
            customer_id: true,
            sale_date: true,
            value: true,
            created_at: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    res.status(201).json({
        status: 'success',
        message: 'Venda registrada com sucesso.',
        data: {
            sale: newSale,
        },
    });
});

// GET /api/sales/statistics/daily - Get total sales per day to client authenticated
export const getDailySalesStatistics = catchAsync(async (req: Request, res: Response) => {
    if (!req.customer || !req.customer.customerId) {
        throw new ApiError(401, 'ID do cliente não encontrado no token de autenticação.');
    }

    const customerId = req.customer.customerId;

    const salesByDay = await prisma.sale.groupBy({
        by: ['sale_date'],
        _sum: {
            value: true,
        },
        where: {
            customer_id: customerId,
        },
        orderBy: {
            sale_date: 'asc',
        },
    });

    const formattedStatistics = salesByDay.map(entry => ({
        date: entry.sale_date.toISOString().split('T')[0],
        totalSales: entry._sum.value?.toNumber() || 0,
    }));

    res.status(200).json({
        status: 'success',
        message: 'Estatísticas de vendas por dia obtidas com sucesso.',
        data: {
            statistics: formattedStatistics,
        },
    });
});

// GET /api/sales/statistics/top-volume-customer - Get the client with the highest sales volume
export const getTopVolumeCustomer = catchAsync(async (req: Request, res: Response) => {
    const topVolumeCustomer = await prisma.sale.groupBy({
        by: ['customer_id'],
        _sum: {
            value: true,
        },
        orderBy: {
            _sum: {
                value: 'desc',
            },
        },
        take: 1,
    });

    let customerData = null;
    if (topVolumeCustomer.length > 0) {
        const customer = await prisma.customer.findUnique({
            where: { id: topVolumeCustomer[0].customer_id },
            select: { id: true, name: true, email: true }
        });
        customerData = {
            customer: customer,
            totalSalesVolume: topVolumeCustomer[0]._sum.value?.toNumber() || 0,
        };
    }

    res.status(200).json({
        status: 'success',
        message: 'Cliente com maior volume de vendas obtido com sucesso.',
        data: {
            topCustomer: customerData,
        },
    });
});

// GET /api/sales/statistics/top-avg-value-customer - Get the client with the highest average sale value
export const getTopAverageValueCustomer = catchAsync(async (req: Request, res: Response) => {
    const customersWithAvg = await prisma.sale.groupBy({
        by: ['customer_id'],
        _avg: {
            value: true,
        },
        orderBy: {
            _avg: {
                value: 'desc',
            },
        },
        take: 1,
        having: {
            customer_id: {
                _count: {
                    gt: 0
                }
            }
        }
    });

    let customerData = null;
    if (customersWithAvg.length > 0) {
        const customer = await prisma.customer.findUnique({
            where: { id: customersWithAvg[0].customer_id },
            select: { id: true, name: true, email: true }
        });
        customerData = {
            customer: customer,
            averageSaleValue: customersWithAvg[0]._avg.value?.toNumber() || 0,
        };
    }

    res.status(200).json({
        status: 'success',
        message: 'Cliente com maior média de valor por venda obtido com sucesso.',
        data: {
            topCustomer: customerData,
        },
    });
});

// GET /api/sales/statistics/top-frequency-customer - Get the client with the highest number of sales
export const getTopFrequencyCustomer = catchAsync(async (req: Request, res: Response) => {
    const customersWithFrequency = await prisma.sale.groupBy({
        by: ['customer_id'],
        _count: {
            id: true,
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
        take: 1,
    });

    let customerData = null;
    if (customersWithFrequency.length > 0) {
        const customer = await prisma.customer.findUnique({
            where: { id: customersWithFrequency[0].customer_id },
            select: { id: true, name: true, email: true }
        });
        customerData = {
            customer: customer,
            purchaseCount: customersWithFrequency[0]._count.id || 0,
        };
    }

    res.status(200).json({
        status: 'success',
        message: 'Cliente com maior frequência de compra obtido com sucesso.',
        data: {
            topCustomer: customerData,
        },
    });
});