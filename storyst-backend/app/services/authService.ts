import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string

export const authService = {
    async register(email: string, password: string, name: string, birthDate: string) {
        //If user already exists
        const existingUser = await prisma.customer.findUnique({
            where: { email }
        })

        if(existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.customer.create({
            data: {
                email,
                password_hash: hashedPassword,
                name,
                birth_date: new Date(birthDate),
                created_at: new Date(),
            }
        })

        const token = jwt.sign({ customerId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return { user, token }
    },

    async login(email: string, password: string) {
        const user = await prisma.customer.findUnique({
            where: { email }
        })

        if(!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if(!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ customerId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return { user, token }
    }
}