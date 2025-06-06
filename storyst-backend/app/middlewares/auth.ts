import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: 'fail',
      message: "ID do cliente não encontrado no token de autenticação."
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      customerId: string;
      email: string;
    };

    req.user = { id: decoded.customerId, email: decoded.email };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        status: 'fail',
        message: "Token de autenticação expirado."
      });
      return;
    }
    res.status(401).json({
      status: 'fail',
      message: "Token de autenticação inválido."
    });
    return;
  }
};

export default authMiddleware;
