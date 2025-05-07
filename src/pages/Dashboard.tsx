import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CubeIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { data: stockSummary, isLoading: stockLoading } = useQuery({
    queryKey: ['stock-summary'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/stock-summary');
      return response.data;
    },
  });

  const { data: financeSummary, isLoading: financeLoading } = useQuery({
    queryKey: ['finance-summary'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/finance-summary');
      return response.data;
    },
  });

  if (stockLoading || financeLoading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      name: 'Total Penjualan',
      value: `Rp ${financeSummary?.totalSales?.toLocaleString() || 0}`,
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Total Pembelian',
      value: `Rp ${financeSummary?.totalPurchases?.toLocaleString() || 0}`,
      icon: ShoppingBagIcon,
    },
    {
      name: 'Total Produk',
      value: stockSummary?.totalProducts || 0,
      icon: CubeIcon,
    },
    {
      name: 'Total Stok',
      value: stockSummary?.totalStockValue?.toLocaleString() || 0,
      icon: BanknotesIcon,
    },
    {
      name: 'Piutang',
      value: `Rp ${financeSummary?.accountsReceivable?.toLocaleString() || 0}`,
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'Hutang',
      value: `Rp ${financeSummary?.accountsPayable?.toLocaleString() || 0}`,
      icon: ArrowTrendingDownIcon,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 