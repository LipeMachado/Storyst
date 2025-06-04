import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import type { LoginResponse } from '@/types/api';
import type { AxiosError } from 'axios';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
            const { token, user } = response.data;
            login(token, user);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            console.error('Erro no login:', axiosError.response?.data?.message || axiosError.message);
            alert(`Erro no login: ${axiosError.response?.data?.message || axiosError.message}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Login</CardTitle>
                    <CardDescription className="text-center">Entre na sua conta para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className='mb-3'>Email</Label>
                            <Input id="email" type="email" placeholder="exemplo@gmail.com" {...form.register('email')} />
                            {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className='mb-3'>Senha</Label>
                            <Input id="password" type="password" placeholder="******" {...form.register('password')} />
                            {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">Entrar</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Não tem uma conta? <Link to="/register" className="ml-1 text-blue-600 hover:underline">Registre-se</Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;