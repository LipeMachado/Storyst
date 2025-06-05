import axiosInstance from './axiosInstance';
import { normalizeCustomerData } from './customerNormalizer';
import type { ComplexCustomerResponse } from './customerNormalizer';

export interface Customer {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerResponse {
  status: string;
  results: number;
  data: {
    customers: Customer[];
  };
}

export interface DeleteCustomerResponse {
  status: string;
  message: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  birth_date?: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    try {
      const response = await axiosInstance.get<CustomerResponse>('/customers');
      return response.data.data.customers;
    } catch (formatError) {
      const complexResponse = await axiosInstance.get<ComplexCustomerResponse>('/customers');
      const normalizedData = normalizeCustomerData(complexResponse.data);
      return normalizedData.data.customers;
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await axiosInstance.get<{status: string; data: {customer: Customer}}>(`/customers/${id}`);
    return response.data.data.customer;
  } catch (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    throw error;
  }
};

export const updateCustomer = async (id: string, data: UpdateCustomerData): Promise<Customer> => {
  try {
    const response = await axiosInstance.put<{status: string; data: {customer: Customer}}>(`/customers/${id}`, data);
    return response.data.data.customer;
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/customers/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir cliente ${id}:`, error);
    throw error;
  }
};