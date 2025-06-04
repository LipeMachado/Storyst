import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import prisma from "../config/prisma";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, birthDate } = req.body;

    if (!email || !password || !name || !birthDate) {
      return res.status(400).json({
        message: "Email, senha, nome e data de nascimento são obrigatórios",
      });
    }

    const { user, token } = await authService.register(
      email,
      password,
      name,
      birthDate
    );
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    const { user, token } = await authService.login(email, password);
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutPassword,
      token,
    });
  }),

  getDashboardData: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Dados do cliente (customer) não encontrados." });
    }

    const dashboardStats = {
      totalSales: 1234.56,
      activeCustomers: 78,
    };

    res.status(200).json({
      status: "success",
      user: customer,
      dashboardStats,
    });
  }),
};
