import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomerList from '@/components/CustomerList';
import AddCustomerDialog from '@/components/AddCustomerDialog';
import { 
  getTopVolumeCustomer, 
  getTopAverageValueCustomer, 
  getTopFrequencyCustomer 
} from '@/api/statisticsService';
import type { 
  TopVolumeCustomer, 
  TopAverageValueCustomer,
  TopFrequencyCustomer 
} from '@/api/statisticsService';

const CustomersPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [topVolumeCustomer, setTopVolumeCustomer] = useState<TopVolumeCustomer | null>(null);
  const [topAvgCustomer, setTopAvgCustomer] = useState<TopAverageValueCustomer | null>(null);
  const [topFreqCustomer, setTopFreqCustomer] = useState<TopFrequencyCustomer | null>(null);
  const [, setStatsLoading] = useState<boolean>(true);

  const fetchTopCustomers = async () => {
    setStatsLoading(true);
    try {
      const [volumeData, avgData, freqData] = await Promise.all([
        getTopVolumeCustomer(),
        getTopAverageValueCustomer(),
        getTopFrequencyCustomer()
      ]);
      
      setTopVolumeCustomer(volumeData);
      setTopAvgCustomer(avgData);
      setTopFreqCustomer(freqData);
    } catch (err) {
      console.error('Erro ao buscar clientes top:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTopCustomers();
    }
  }, [isAuthenticated]);

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
        <Button onClick={() => navigate('/')}>Ir para Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-green-700">Gerenciamento de Clientes</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <AddCustomerDialog />
            <Button onClick={() => navigate('/')}>
              Voltar para Dashboard
            </Button>
          </div>
        </div>

        <CustomerList 
          onRefresh={fetchTopCustomers}
          topVolumeCustomer={topVolumeCustomer}
          topAvgCustomer={topAvgCustomer}
          topFreqCustomer={topFreqCustomer}
        />
      </div>
    </div>
  );
};

export default CustomersPage;