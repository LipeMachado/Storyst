import type { Customer } from './customerService';

export interface ComplexCustomerResponse {
  data: {
    clientes: Array<{
      id: string;
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
      created_at?: string;
      updated_at?: string;
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
  if (!complexData?.data?.clientes) {
    return {
      status: 'error',
      results: 0,
      data: {
        customers: []
      }
    };
  }

  const normalizedCustomers: Customer[] = complexData.data.clientes.map((cliente) => {
    const name = cliente.info?.nomeCompleto || 'Nome não disponível';
    const email = cliente.info?.detalhes?.email || 'email@indisponivel.com';
    const birth_date = cliente.info?.detalhes?.nascimento || '';

    const id = cliente.id;
    
    const now = new Date().toISOString();
    const created_at = cliente.created_at || now;
    const updated_at = cliente.updated_at || now;

    return {
      id,
      name,
      email,
      birth_date,
      created_at,
      updated_at
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