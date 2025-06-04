export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface DashboardResponse {
  status: string;
  user: User;
  dashboardStats: {
    totalSales: number;
    activeCustomers: number;
  };
}
