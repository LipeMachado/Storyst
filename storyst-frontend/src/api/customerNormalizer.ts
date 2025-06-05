import type { Customer } from './customerService';

export interface ComplexCustomerResponse {
  data: {
    clientes: Array<{
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string;
        }
      };
      estatisticas?: {
        vendas: Array<{
          data: string;
          valor: number;
        }>;
      };
      duplicado?: {
        nomeCompleto: string;
      };
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante?: {
    status: string;
  };
}

export interface NormalizedCustomerResponse {
  status: string;
  results: number;
  data: {
    customers: Customer[];
  };
}

export const normalizeCustomerData = (complexData: ComplexCustomerResponse): NormalizedCustomerResponse => {
  const normalizedCustomers: Customer[] = complexData.data.clientes.map((cliente, index) => {
    return {
      id: `customer-${index}`,
      name: cliente.info.nomeCompleto,
      email: cliente.info.detalhes.email,
      birth_date: cliente.info.detalhes.nascimento,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  return {
    status: 'success',
    results: normalizedCustomers.length,
    data: {
      customers: normalizedCustomers
    }
  };
};