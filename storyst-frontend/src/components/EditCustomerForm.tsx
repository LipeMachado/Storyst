import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateCustomer, getCustomerById } from '@/api/customerService';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

const customerEditSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Adicione uma data de nascimento'),
});

export type CustomerEditFormData = z.infer<typeof customerEditSchema>;

interface EditCustomerFormProps {
  customerId: string;
  onSuccess: () => void;
}

const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customerId, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);

  const form = useForm<CustomerEditFormData>({
    resolver: zodResolver(customerEditSchema),
    defaultValues: { name: '', email: '', birthDate: '' },
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const customer = await getCustomerById(customerId);

        let birthDate = '';
        if (customer.birth_date) {
          if (typeof customer.birth_date === 'string') {
            const date = new Date(customer.birth_date);
            birthDate = date.toISOString().split('T')[0];
          } else if (typeof customer.birth_date === 'object') {
            birthDate = '';
          }
        }

        form.reset({
          name: customer.name,
          email: customer.email,
          birthDate: birthDate
        });
      } catch (error) {
        toast.error('Erro ao carregar dados do cliente');
        console.error('Erro ao carregar cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, form]);

  const onSubmit = async (data: CustomerEditFormData) => {
    setEmailError(null);
  
    try {
      const formattedData = {
        name: data.name,
        email: data.email,
        birth_date: data.birthDate
      };
  
      await updateCustomer(customerId, formattedData);
      toast.success('Cliente atualizado com sucesso!');
      onSuccess();
    } catch (error: unknown) {
      let errorMessage = 'Ocorreu um erro desconhecido.';

      if (isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          errorMessage = (error.response.data as { message: string }).message;

          if (errorMessage.includes('email')) {
            setEmailError('Este email já está em uso por outro cliente.');
            form.setFocus('email');
          }
          toast.error(errorMessage);
        } else if (error.message) {
          errorMessage = error.message;
          toast.error(errorMessage);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando dados do cliente...</div>;
  }

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
        <Input 
          id="birthDate" 
          type="date" 
          {...form.register('birthDate')} 
        />
        {form.formState.errors.birthDate && <p className="text-red-500 text-sm mt-1">{form.formState.errors.birthDate.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar Cliente'}
      </Button>
    </form>
  );
};

export default EditCustomerForm;