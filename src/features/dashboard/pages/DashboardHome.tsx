import { useQuery } from '@tanstack/react-query';
import { getStockSummary, getFinanceSummary } from '../../../api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { ArrowDownIcon, ArrowUpIcon, BanknotesIcon, BuildingStorefrontIcon, CurrencyDollarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Skeleton } from '../../../components/ui/Skeleton';

interface LowStockItem {
  id: number;
  name: string;
  qty: number;
}

const DashboardHome = () => {
  const { data: stockSummary, isLoading: stockLoading } = useQuery({
    queryKey: ['stock-summary'],
    queryFn: getStockSummary,
  });

  const { data: financeSummary, isLoading: financeLoading } = useQuery({
    queryKey: ['finance-summary'],
    queryFn: getFinanceSummary,
  });

  const isLoading = stockLoading || financeLoading;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      name: 'Total Penjualan',
      value: formatCurrency(financeSummary?.totalSales || 0),
      description: 'Total penjualan keseluruhan',
      icon: CurrencyDollarIcon,
      trend: financeSummary?.salesTrend || '0%',
      trendUp: (financeSummary?.salesTrend || '0%').startsWith('+'),
    },
    {
      name: 'Total Pembelian',
      value: formatCurrency(financeSummary?.totalPurchases || 0),
      description: 'Total pembelian keseluruhan',
      icon: ShoppingBagIcon,
      trend: financeSummary?.purchaseTrend || '0%',
      trendUp: (financeSummary?.purchaseTrend || '0%').startsWith('+'),
    },
    {
      name: 'Total Produk',
      value: stockSummary?.totalProducts || 0,
      description: 'Jumlah produk aktif',
      icon: BuildingStorefrontIcon,
      trend: `${stockSummary?.newProducts || 0} produk baru`,
      trendUp: (stockSummary?.newProducts || 0) > 0,
    },
    {
      name: 'Total Stok',
      value: formatCurrency(stockSummary?.totalStockValue || 0),
      description: 'Nilai total stok',
      icon: BanknotesIcon,
      trend: `${stockSummary?.newStock || 0} stok baru`,
      trendUp: (stockSummary?.newStock || 0) > 0,
    },
  ];

  const financialStats = [
    {
      name: 'Kas & Bank',
      value: formatCurrency(financeSummary?.cashBalance || 0),
      description: 'Saldo kas dan bank',
      trend: financeSummary?.cashBalance > 0 ? 'Positif' : 'Negatif',
      trendUp: financeSummary?.cashBalance > 0,
    },
    {
      name: 'Piutang',
      value: formatCurrency(financeSummary?.accountsReceivable || 0),
      description: 'Total piutang',
      trend: financeSummary?.accountsReceivable > 0 ? 'Perlu ditagih' : 'Lunas',
      trendUp: financeSummary?.accountsReceivable > 0,
    },
    {
      name: 'Hutang',
      value: formatCurrency(financeSummary?.accountsPayable || 0),
      description: 'Total hutang',
      trend: financeSummary?.accountsPayable > 0 ? 'Perlu dibayar' : 'Lunas',
      trendUp: financeSummary?.accountsPayable > 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center text-xs mt-2">
                {stat.trendUp ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {financialStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center text-xs mt-2">
                {stat.trendUp ? (
                  <ArrowUpIcon className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={stat.trendUp ? 'text-yellow-500' : 'text-green-500'}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stockSummary?.lowStockItems && stockSummary.lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produk dengan Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockSummary.lowStockItems.map((item: LowStockItem) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Stok: {item.qty}</p>
                  </div>
                  <div className="text-red-500 text-sm">Perlu ditambah</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome; 