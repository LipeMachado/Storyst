import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/api/axiosInstance';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Formato de data inválido (DD-MM-AAAA)'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface AddCustomerFormProps {
  onSuccess: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSuccess }) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', birthDate: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setEmailError(null);
    
    try {
      const formattedData = {
        name: data.name,
        email: data.email,
        birthDate: data.birthDate,
        password: data.password
      };
      
      await axiosInstance.post('/auth/register', formattedData);
      form.reset();
      toast.success('Cliente cadastrado com sucesso!');
      onSuccess();
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro desconhecido.';

      if (isAxiosError(error)) {
        form.reset({ ...data }, { keepValues: true, keepErrors: true, keepDirty: true, keepIsSubmitted: false, keepTouched: true, keepIsValid: true, keepSubmitCount: true });
        
        if (error.response?.data) {
          const responseData = error.response.data;
          
          if (error.response.status === 409) {
            if (responseData.errors && Array.isArray(responseData.errors)) {
              const emailErrorObj = responseData.errors.find((err: { path: string | string[] }) =>
                err.path === 'email' || (Array.isArray(err.path) && err.path.includes('email'))
              );
              
              if (emailErrorObj) {
                errorMessage = emailErrorObj.message;
              } else {
                errorMessage = responseData.message || 'Este email já está cadastrado';
              }
            } else {
              errorMessage = responseData.message || 'Este email já está cadastrado';
            }
            
            setEmailError(errorMessage);
            form.setFocus('email');
          } else if (typeof responseData === 'object' && 'message' in responseData) {
            errorMessage = responseData.message as string;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        form.reset({ ...data }, { keepValues: true, keepErrors: true, keepDirty: true, keepIsSubmitted: false, keepTouched: true, keepIsValid: true, keepSubmitCount: true });
        errorMessage = error.message;
        toast.error(errorMessage);
      } else {
        form.reset({ ...data }, { keepValues: true, keepErrors: true, keepDirty: true, keepIsSubmitted: false, keepTouched: true, keepIsValid: true, keepSubmitCount: true });
        toast.error(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" type="text" placeholder="Nome do Cliente" {...form.register('name')} />
        {form.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          placeholder="cliente@exemplo.com" 
          {...form.register('email')} 
          className={emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          onChange={() => emailError && setEmailError(null)}
        />
        {form.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>}
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input id="birthDate" type="date" {...form.register('birthDate')} />
        {form.formState.errors.birthDate && <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" placeholder="Sua senha" {...form.register('password')} />
        {form.formState.errors.password && <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input id="confirmPassword" type="password" placeholder="Confirme sua senha" {...form.register('confirmPassword')} />
        {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
      </Button>
    </form>
  );
};

export default AddCustomerForm;