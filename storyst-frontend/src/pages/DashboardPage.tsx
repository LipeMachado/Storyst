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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [dailyStats, setDailyStats] = useState<DailySalesStatistic[]>([]);
  const [topVolumeCustomer, setTopVolumeCustomer] = useState<TopVolumeCustomer | null>(null);
  const [topAvgCustomer, setTopAvgCustomer] = useState<TopAverageValueCustomer | null>(null);
  const [topFreqCustomer, setTopFreqCustomer] = useState<TopFrequencyCustomer | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [salesGrowth, setSalesGrowth] = useState<number | null>(null);

  const calculateSalesGrowth = (salesData: DailySalesStatistic[]) => {
    if (!salesData || salesData.length === 0) return null;
    
    const sortedData = [...salesData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latestDate = new Date(sortedData[0].date);
    
    const currentPeriodEnd = new Date(latestDate);
    const currentPeriodStart = new Date(latestDate);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
    
    const previousPeriodEnd = new Date(currentPeriodStart);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
    const previousPeriodStart = new Date(previousPeriodEnd);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
    
    const currentPeriodSales = sortedData
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= currentPeriodStart && saleDate <= currentPeriodEnd;
      })
      .reduce((total, sale) => total + sale.totalSales, 0);
    
    const previousPeriodSales = sortedData
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= previousPeriodStart && saleDate <= previousPeriodEnd;
      })
      .reduce((total, sale) => total + sale.totalSales, 0);
    
    if (previousPeriodSales === 0) {
      return currentPeriodSales > 0 ? 100 : 0;
    }
    
    const growthRate = ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;
    return Math.round(growthRate);
  };
  
  const fetchStatistics = async () => {
    setStatsLoading(true);
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
      
      const growth = calculateSalesGrowth(dailyData);
      setSalesGrowth(growth);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      toast.error('Erro ao buscar estatísticas. Tente novamente mais tarde.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics();
    }
  }, [isAuthenticated]);

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
        <Button onClick={() => navigate('/login')}>Ir para Login</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.name}!</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AddCustomerDialog />
          <Button variant="outline" onClick={fetchStatistics}>Atualizar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Vendas Hoje"
          value={statsLoading ? "Carregando..." : dailyStats.length > 0 ?
            formatCurrency(dailyStats[dailyStats.length - 1].totalSales) : "R$ 0,00"}
          icon={<span>💰</span>}
        />
        <DashboardCard
          title="Total de Vendas"
          value={statsLoading ? "Carregando..." :
            formatCurrency(dailyStats.reduce((sum, stat) => sum + stat.totalSales, 0))}
          icon={<span>📈</span>}
        />
        <DashboardCard
          title="Dias com Vendas"
          value={statsLoading ? "Carregando..." : dailyStats.length}
          icon={<span>📅</span>}
        />
        <DashboardCard
          title="Média por Dia"
          value={statsLoading ? "Carregando..." :
            formatCurrency(dailyStats.length > 0 ?
              dailyStats.reduce((sum, stat) => sum + stat.totalSales, 0) / dailyStats.length : 0)}
          icon={<span>⚖️</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="">
                <DailySalesChart statistics={dailyStats} />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <DailySalesTable statistics={dailyStats} />
          </div>

        </div>
        <div className="lg:col-span-1 grid gap-4">
          <div className="grid grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 gap-4">
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

          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-blue-100 rounded-lg">
                <div className="text-center">
                  {statsLoading ? (
                    <div className="text-3xl font-bold text-blue-500">Carregando...</div>
                  ) : salesGrowth !== null ? (
                    <>
                      <div className={`text-3xl font-bold ${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {salesGrowth >= 0 ? '+' : ''}{salesGrowth}%
                      </div>
                      <div className="text-sm text-blue-700">Crescimento de vendas</div>
                      <div className="text-xs text-gray-500 mt-1">Últimos 30 dias vs período anterior</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-blue-500">N/A</div>
                      <div className="text-sm text-blue-700">Crescimento de vendas</div>
                      <div className="text-xs text-gray-500 mt-1">Dados insuficientes</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;