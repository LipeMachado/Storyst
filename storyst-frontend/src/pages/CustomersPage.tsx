import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import CustomerList from '@/components/CustomerList';
import AddCustomerDialog from '@/components/AddCustomerDialog';

const CustomersPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-xl text-red-500 mb-4">Acesso negado. Por favor, faça login.</p>
        <Button onClick={() => logout()}>Ir para Login</Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
            <AddCustomerDialog buttonText="Novo Cliente" />
        </div>
        
        <CustomerList key={refreshKey} onRefresh={handleRefresh} />
        
        <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
            </Button>
        </div>
        </div>
    </div>
  );
};

export default CustomersPage;