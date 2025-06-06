import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middlewares/auth";
import prisma from "../config/prisma";
import catchAsync from "../utils/catchAsync";

import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  catchAsync(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: req.user.id },
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
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    return res.status(200).json({
      message: "Perfil do cliente obtido com sucesso.",
      customer: customer,
    });
  })
);

router.get("/", authMiddleware, getAllCustomers);

// GET /api/customers/:id - Get a single client(customer) by ID
router.get("/:id", authMiddleware, getCustomerById);

// PUT /api/customers/:id - Update a client(customer) by ID
router.put("/:id", authMiddleware, updateCustomer);

// DELETE /api/customers/:id - Remove a client(customer) by ID
router.delete("/:id", authMiddleware, deleteCustomer);

export default router;
