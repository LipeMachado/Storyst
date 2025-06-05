import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import DashboardCard from '@/components/DashboardCard';
import TopCustomerCard from '@/components/TopCustomerCard';
import DailySalesTable from '@/components/DailySalesTable';
import AddCustomerDialog from '@/components/AddCustomerDialog';
import { useNavigate } from 'react-router-dom';
import { 
  getDailySalesStatistics, 
  getTopVolumeCustomer, 
  getTopAverageValueCustomer, 
  getTopFrequencyCustomer,
} from '@/api/statisticsService';
import type { DailySalesStatistic, TopVolumeCustomer, TopAverageValueCustomer, TopFrequencyCustomer } from '@/api/statisticsService';
import DailySalesChart from '@/components/DailySalesChart';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [dailyStats, setDailyStats] = useState<DailySalesStatistic[]>([]);
  const [topVolumeCustomer, setTopVolumeCustomer] = useState<TopVolumeCustomer | null>(null);
  const [topAvgCustomer, setTopAvgCustomer] = useState<TopAverageValueCustomer | null>(null);
  const [topFreqCustomer, setTopFreqCustomer] = useState<TopFrequencyCustomer | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const [dailyData, volumeData, avgData, freqData] = await Promise.all([
        getDailySalesStatistics(),
        getTopVolumeCustomer(),
        getTopAverageValueCustomer(),
        getTopFrequencyCustomer()
      ]);
      
      setDailyStats(dailyData);
      setTopVolumeCustomer(volumeData);
      setTopAvgCustomer(avgData);
      setTopFreqCustomer(freqData);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      setStatsError('Não foi possível carregar as estatísticas.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics();
    }
  }, [isAuthenticated]);

  // Formatadores para os valores dos cards
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

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
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl text-center md:text-left font-bold text-green-700">
            Bem-vindo ao Dashboard, {user.name}!
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <AddCustomerDialog />
            <Button onClick={() => navigate('/customers')}>
              Listar Clientes
            </Button>
            <Button variant="destructive" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="Vendas Hoje" 
            value={statsLoading ? "Carregando..." : dailyStats.length > 0 ? 
              formatCurrency(dailyStats[dailyStats.length - 1].totalSales) : "R$ 0,00"} 
          />
          <DashboardCard 
            title="Total de Vendas" 
            value={statsLoading ? "Carregando..." : 
              formatCurrency(dailyStats.reduce((sum, stat) => sum + stat.totalSales, 0))} 
          />
          <DashboardCard 
            title="Dias com Vendas" 
            value={statsLoading ? "Carregando..." : dailyStats.length} 
          />
        </div>

        {statsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{statsError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchStatistics} 
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Clientes em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopCustomerCard
              title="Maior Volume"
              description="Cliente com maior volume total de vendas"
              customer={topVolumeCustomer}
              valueLabel="Volume total"
              valueFormatter={(customer) => formatCurrency((customer as TopVolumeCustomer).totalSalesVolume)}
            />
            <TopCustomerCard
              title="Maior Média"
              description="Cliente com maior valor médio por venda"
              customer={topAvgCustomer}
              valueLabel="Valor médio"
              valueFormatter={(customer) => formatCurrency((customer as TopAverageValueCustomer).averageSaleValue)}
            />
            <TopCustomerCard
              title="Maior Frequência"
              description="Cliente com maior número de compras"
              customer={topFreqCustomer}
              valueLabel="Total de compras"
              valueFormatter={(customer) => `${(customer as TopFrequencyCustomer).purchaseCount} compras`}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Histórico de Vendas</h2>
          <div className="space-y-6 flex flex-col gap-20">
            <div className="w-full h-[500px]">
              <DailySalesChart statistics={dailyStats} />
            </div>
            <DailySalesTable statistics={dailyStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;