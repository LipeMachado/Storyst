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

function ensureDateString(dateValue: string | Date | object | null | undefined): string {
  if (!dateValue) return '';
  
  if (typeof dateValue === 'object' && dateValue !== null) {
    // Se for um objeto vazio
    if (Object.keys(dateValue).length === 0) {
      return new Date().toISOString();
    }
    // Se for um objeto Date
    if (dateValue instanceof Date) {
      return dateValue.toISOString();
    }
  }
  
  return String(dateValue);
}

/**
 * Normalizes complex customer data into a standardized format
 * @param complexData Complex API Data
 * @returns Normalized data
 */
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

  const normalizedCustomers = complexData.data.clientes.map(() => {
    complexData.data.clientes.map((cliente) => {
      const name = cliente.info?.nomeCompleto || 'Nome não disponível';
      const email = cliente.info?.detalhes?.email || 'email@indisponivel.com';
      const birth_date = ensureDateString(cliente.info?.detalhes?.nascimento || '');
          
      const id = cliente.id;
      
      const now = new Date().toISOString();
      const created_at = ensureDateString(cliente.created_at || now);
      const updated_at = ensureDateString(cliente.updated_at || now);
  
      return {
        id,
        name,
        email,
        birth_date,
        created_at,
        updated_at
      };
    });
  });

  return {
    status: 'success',
    results: normalizedCustomers.length,
    data: {
      customers: complexData.data.clientes.map((cliente) => {
        const name = cliente.info?.nomeCompleto || 'Nome não disponível';
        const email = cliente.info?.detalhes?.email || 'email@indisponivel.com';
        const birth_date = ensureDateString(cliente.info?.detalhes?.nascimento || '');
            
        const id = cliente.id;
        
        const now = new Date().toISOString();
        const created_at = ensureDateString(cliente.created_at || now);
        const updated_at = ensureDateString(cliente.updated_at || now);
    
        return {
          id,
          name,
          email,
          birth_date,
          created_at,
          updated_at
        };
      })
    }
  };
};