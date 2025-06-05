import axiosInstance from './axiosInstance';

export interface DailySalesStatistic {
  date: string;
  totalSales: number;
}

export interface TopCustomer {
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TopVolumeCustomer extends TopCustomer {
  totalSalesVolume: number;
}

export interface TopAverageValueCustomer extends TopCustomer {
  averageSaleValue: number;
}

export interface TopFrequencyCustomer extends TopCustomer {
  purchaseCount: number;
}

export const getDailySalesStatistics = async (): Promise<DailySalesStatistic[]> => {
  try {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
      data: { statistics: DailySalesStatistic[] };
    }>('/sales/statistics/daily');
    return response.data.data.statistics;
  } catch (error) {
    console.error('Erro ao buscar estatísticas diárias de vendas:', error);
    throw error;
  }
};

export const getTopVolumeCustomer = async (): Promise<TopVolumeCustomer | null> => {
  try {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
      data: { topCustomer: TopVolumeCustomer | null };
    }>('/sales/statistics/top-volume-customer');
    return response.data.data.topCustomer;
  } catch (error) {
    console.error('Erro ao buscar cliente com maior volume de vendas:', error);
    throw error;
  }
};

export const getTopAverageValueCustomer = async (): Promise<TopAverageValueCustomer | null> => {
  try {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
      data: { topCustomer: TopAverageValueCustomer | null };
    }>('/sales/statistics/top-avg-value-customer');
    return response.data.data.topCustomer;
  } catch (error) {
    console.error('Erro ao buscar cliente com maior média de valor por venda:', error);
    throw error;
  }
};

export const getTopFrequencyCustomer = async (): Promise<TopFrequencyCustomer | null> => {
  try {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
      data: { topCustomer: TopFrequencyCustomer | null };
    }>('/sales/statistics/top-frequency-customer');
    return response.data.data.topCustomer;
  } catch (error) {
    console.error('Erro ao buscar cliente com maior frequência de compra:', error);
    throw error;
  }
};