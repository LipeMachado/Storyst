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
import EditCustomerDialog from './EditCustomerDialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TopVolumeCustomer, TopAverageValueCustomer, TopFrequencyCustomer } from '@/api/statisticsService';

interface CustomerListProps {
  onRefresh?: () => void;
  topVolumeCustomer?: TopVolumeCustomer | null;
  topAvgCustomer?: TopAverageValueCustomer | null;
  topFreqCustomer?: TopFrequencyCustomer | null;
}

const CustomerList: React.FC<CustomerListProps> = ({
  onRefresh,
  topVolumeCustomer,
  topAvgCustomer,
  topFreqCustomer
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const customersPerPage = 6;

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
      setCurrentPage(1);
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

  const getCustomerTopStatus = (customerId: string) => {
    const statuses = [];

    if (topVolumeCustomer?.customer.id === customerId) {
      statuses.push({
        type: 'volume',
        label: 'Maior Volume',
        description: `Cliente com maior volume total de vendas: ${topVolumeCustomer.totalSalesVolume.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}`
      });
    }

    if (topAvgCustomer?.customer.id === customerId) {
      statuses.push({
        type: 'average',
        label: 'Maior Média',
        description: `Cliente com maior valor médio por venda: ${topAvgCustomer.averageSaleValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}`
      });
    }

    if (topFreqCustomer?.customer.id === customerId) {
      statuses.push({
        type: 'frequency',
        label: 'Maior Frequência',
        description: `Cliente com maior número de compras: ${topFreqCustomer.purchaseCount} compras`
      });
    }

    return statuses;
  };

  const totalPages = Math.ceil(customers.length / customersPerPage);

  const currentCustomers = customers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
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
        <CardTitle className='flex justify-between items-center'>
          <span>
            Lista de Clientes
          </span>
          <Button onClick={fetchCustomers} variant="outline">
            Atualizar Lista
          </Button>
        </CardTitle>
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
            {currentCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              currentCustomers.map((customer) => {
                const topStatuses = getCustomerTopStatus(customer.id);

                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {customer.name}
                        {topStatuses.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex gap-1">
                                  {topStatuses.map((status, index) => (
                                    <Badge
                                      key={index}
                                      className={`
                                        ${status.type === 'volume' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        ${status.type === 'average' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                        ${status.type === 'frequency' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                      `}
                                    >
                                      {status.label}
                                    </Badge>
                                  ))}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <div className="space-y-1">
                                  {topStatuses.map((status, index) => (
                                    <p key={index}>{status.description}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{formatDate(customer.birth_date)}</TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                    <TableCell className="text-center font-bold">
                      {findFirstMissingLetter(customer.name)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditCustomerDialog
                          customerId={customer.id}
                          onSuccess={fetchCustomers}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          disabled={isDeleting === customer.id}
                        >
                          {isDeleting === customer.id ? 'Excluindo...' : 'Excluir'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="hidden sm:inline-flex"
            >
              Primeira
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (window.innerWidth < 640) {
                    return page === 1 || page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);
                  }
                  return page === 1 || page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2);
                })
                .map(page => (
                  <React.Fragment key={page}>
                    {page > 1 &&
                      ((window.innerWidth < 640 && page === currentPage - 1 && currentPage > 2) ||
                        (window.innerWidth >= 640 && page === currentPage - 2 && currentPage > 3)) &&
                      <span className="px-2">...</span>
                    }

                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>

                    {page < totalPages &&
                      ((window.innerWidth < 640 && page === currentPage + 1 && currentPage < totalPages - 1) ||
                        (window.innerWidth >= 640 && page === currentPage + 2 && currentPage < totalPages - 2)) &&
                      <span className="px-2">...</span>
                    }
                  </React.Fragment>
                ))
              }
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:inline-flex"
            >
              Última
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            <span>Página {currentPage} de {totalPages}&nbsp;</span>
            <span>- Total de {customers.length} usuários</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerList;
