import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import DashboardCard from '@/components/DashboardCard';
import AddCustomerDialog from '@/components/AddCustomerDialog';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Carregando dashboard...</p>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-8">
        Bem-vindo ao Dashboard, {user.name}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <DashboardCard title="Vendas Hoje" value="R$ 1.500,00" />
        <DashboardCard title="Clientes Ativos" value={120} />
        <DashboardCard title="Meta Mensal" value="85%" />
      </div>
      <div className="flex gap-4 mt-10">
        <AddCustomerDialog />
        <Button onClick={() => navigate('/customers')}>
          Listar Clientes
        </Button>
        <Button onClick={() => alert('Gerenciar Vendas!')}>
          Gerenciar Vendas
        </Button>
      </div>
      <Button variant="destructive" className="mt-4" onClick={logout}>
        Sair
      </Button>
    </div>
  );
};

export default DashboardPage;