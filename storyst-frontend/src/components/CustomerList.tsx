import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '@/api/customerService';
import type { Customer } from '@/api/customerService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { formatDate, findFirstMissingLetter } from '@/lib/utils';

interface CustomerListProps {
  onRefresh?: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onRefresh }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Erro ao carregar clientes. Tente novamente.');
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setIsDeleting(id);
      try {
        await deleteCustomer(id);
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        toast.success('Cliente excluído com sucesso!');
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error('Erro ao excluir cliente. Tente novamente.');
        console.error('Erro ao excluir cliente:', err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCustomers}>Tentar Novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de todos os clientes cadastrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Letra Ausente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{formatDate(customer.birth_date)}</TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                  <TableCell className="text-center font-bold">
                    {findFirstMissingLetter(customer.name)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                      disabled={isDeleting === customer.id}
                    >
                      {isDeleting === customer.id ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button onClick={fetchCustomers} variant="outline" size="sm">
            Atualizar Lista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;