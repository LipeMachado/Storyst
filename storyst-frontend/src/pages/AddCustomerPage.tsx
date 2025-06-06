import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

const customerSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    birthDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Adicione uma data de nascimento'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const AddCustomerPage: React.FC = () => {
    const navigate = useNavigate();
    const form = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: { name: '', email: '', birthDate: '' },
    });

    const onSubmit = async (data: CustomerFormData) => {
        try {
            const formattedData = {
                ...data,
                birth_date: data.birthDate,
            };
            
            await axiosInstance.post('/customers', formattedData);
            
            toast.success('Cliente adicionado com sucesso!');
            navigate('/');
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

            toast.error(`Erro ao adicionar cliente: ${errorMessage}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Adicionar Cliente</CardTitle>
                    <CardDescription className="text-center">Preencha os dados para adicionar um novo cliente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className='mb-3'>Nome</Label>
                            <Input id="name" type="text" placeholder="Nome do Cliente" {...form.register('name')} />
                            {form.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email" className='mb-3'>Email</Label>
                            <Input id="email" type="email" placeholder="cliente@exemplo.com" {...form.register('email')} />
                            {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="birthDate" className='mb-3'>Data de Nascimento</Label>
                            <Input id="birthDate" type="date" {...form.register('birthDate')} />
                            {form.formState.errors.birthDate && <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">Adicionar Cliente</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => navigate('/')} className="w-full">Voltar</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AddCustomerPage;