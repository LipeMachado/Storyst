import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

// Helper function to handle async errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const authController = {
    register: asyncHandler(async (req: Request, res: Response) => {
        const { email, password, name, birthDate } = req.body;

        if (!email || !password || !name || !birthDate) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { user, token } = await authService.register(email, password, name, birthDate);

        const { password_hash: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token
        })
    }),

    login: asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const { user, token } = await authService.login(email, password);

        const { password_hash: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: "User logged in successfully",
            user: userWithoutPassword,
            token
        });
    })
}