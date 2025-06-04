import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { isAxiosError } from 'axios';
import type { RegisterResponse } from '@/types/api';

const registerSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '', birthDate: '' },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const formattedData = {
                ...data,
                birthDate: new Date(data.birthDate).toISOString().split('T')[0],
            };
            await axiosInstance.post<RegisterResponse>('/auth/register', formattedData);

            alert('Registro realizado com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (error: unknown) {
            let errorMessage = 'Ocorreu um erro desconhecido.';

            if (isAxiosError(error)) {
                if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
                    errorMessage = (error.response.data as { message: string }).message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            alert(`Erro no registro: ${errorMessage}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Registrar</CardTitle>
                    <CardDescription className="text-center">Crie sua conta para começar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className='mb-3'>Nome</Label>
                            <Input id="name" type="text" placeholder="Seu Nome" {...form.register('name')} />
                            {form.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email" className='mb-3'>Email</Label>
                            <Input id="email" type="email" placeholder="exemplo@gmail.com" {...form.register('email')} />
                            {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="birthDate" className='mb-3'>Data de Nascimento</Label>
                            <Input id="birthDate" type="date" {...form.register('birthDate')} />
                            {form.formState.errors.birthDate && <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className='mb-3'>Senha</Label>
                            <Input id="password" type="password" placeholder="******" {...form.register('password')} />
                            {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className='mb-3'>Confirmar Senha</Label>
                            <Input id="confirmPassword" placeholder="******" type="password" {...form.register('confirmPassword')} />
                            {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">Registrar</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Já tem uma conta? <Link to="/login" className="ml-1 text-blue-600 hover:underline">Login</Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;