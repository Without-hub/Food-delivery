import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import OrdersPage from '@/pages/orders';
import OrderDetailPage from '@/pages/orders/detail';
import DishesPage from '@/pages/dishes';
import DishFormPage from '@/pages/dishes/form';
import CategoriesPage from '@/pages/categories';
import UsersPage from '@/pages/users';
import ShopsPage from '@/pages/shops';
import ShopDetailPage from '@/pages/shops/detail';
import DeliveryPage from '@/pages/delivery';
import ReviewsPage from '@/pages/reviews';
import StatisticsPage from '@/pages/statistics';
import SettingsPage from '@/pages/settings';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'dishes', element: <DishesPage /> },
      { path: 'dishes/new', element: <DishFormPage /> },
      { path: 'dishes/:id/edit', element: <DishFormPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'shops', element: <ShopsPage /> },
      { path: 'shops/:id', element: <ShopDetailPage /> },
      { path: 'delivery', element: <DeliveryPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
