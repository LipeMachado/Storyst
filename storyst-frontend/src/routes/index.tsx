import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CustomersPage from '@/pages/CustomersPage';
import AddCustomerPage from '@/pages/AddCustomerPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/customers',
    element: <CustomersPage />,
  },
  {
    path: '/add-customer',
    element: <AddCustomerPage />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}