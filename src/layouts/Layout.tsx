import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ShoppingBagIcon, ClipboardDocumentListIcon, BanknotesIcon, ChartBarIcon, CubeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Akun', href: '/accounts', icon: ChartBarIcon },
  { name: 'Pelanggan', href: '/customers', icon: UserGroupIcon },
  { name: 'Pemasok', href: '/suppliers', icon: UserGroupIcon },
  { name: 'Produk', href: '/products', icon: CubeIcon },
  { name: 'Penjualan', href: '/sales', icon: ShoppingBagIcon },
  { name: 'Pembelian', href: '/purchases', icon: ShoppingBagIcon },
  { name: 'Kas & Bank', href: '/cash-bank', icon: BanknotesIcon },
  { name: 'Anggaran', href: '/budget', icon: ClipboardDocumentListIcon },
  { name: 'Persediaan', href: '/inventory', icon: CubeIcon },
  { name: 'Produksi', href: '/production', icon: Cog6ToothIcon },
];

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary-600">Accounting</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 