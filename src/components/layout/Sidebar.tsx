import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import { useRole } from '../../hooks/useRole';
import { Role } from '../../constants/roles';
import {
  HomeOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  BankOutlined,
  BarChartOutlined,
  InboxOutlined,
  SettingOutlined} from '@ant-design/icons';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeOutlined, roles: ['*'] },
  { name: 'Akun', href: '/accounts', icon: BarChartOutlined, roles: ['admin', 'accounting'] },
  { name: 'Pelanggan', href: '/customers', icon: TeamOutlined, roles: ['admin', 'sales'] },
  { name: 'Pemasok', href: '/suppliers', icon: TeamOutlined, roles: ['admin', 'purchase'] },
  { name: 'Produk', href: '/products', icon: InboxOutlined, roles: ['admin', 'manager'] },
  { name: 'Penjualan', href: '/sales', icon: ShoppingOutlined, roles: ['admin', 'sales'] },
  { 
    name: 'Pembelian', 
    href: '/purchase', 
    icon: ShoppingOutlined, 
    roles: ['admin', 'purchase', 'manager', 'finance'],
    children: [
      { name: 'Purchase Request', href: '/purchase/request' },
      { name: 'Purchase Order', href: '/purchase/orders' },
      { name: 'Goods Receipt', href: '/purchases/receipts' },
      { name: 'Purchase Return', href: '/purchase/return' },
      { name: 'Payment', href: '/purchase/payment' },
    ]
  },
  { 
    name: 'Purchase Invoice', 
    href: '/purchases/invoices', 
    icon: FileTextOutlined, 
    roles: ['admin', 'finance']
  },
  { name: 'Kas & Bank', href: '/cash-bank', icon: BankOutlined, roles: ['admin', 'finance', 'cashier'] },
  { name: 'Anggaran', href: '/budget', icon: FileTextOutlined, roles: ['admin', 'finance'] },
  { 
    name: 'Persediaan', 
    href: '/inventory', 
    icon: InboxOutlined, 
    roles: ['admin', 'finance'],
    children: [
      { name: 'Stok', href: '/inventory/stocks' },
      { name: 'Transfer Stok', href: '/inventory/stock-transfer' },
      { name: 'Stock Opname', href: '/inventory/stock-opname' },
      { name: 'Penyesuaian Stok', href: '/inventory/stock-adjustment' },
    ]
  },
  { name: 'Produksi', href: '/production', icon: SettingOutlined, roles: ['admin', 'finance'] },
];

const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const location = useLocation();
  const { hasRole } = useRole();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const filteredNavigation = navigation.filter((item) => {
    if (item.roles.includes('*' as Role)) return true;
    return item.roles.some((role: string) => hasRole(role as Role));
  });

  const isActiveRoute = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-slate-800 border-r border-slate-700 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'w-64' : 'w-20'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
            <h1 className={`text-xl font-bold text-white transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              Accounting
            </h1>
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 rounded-md hover:bg-slate-700 text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isOpen ? "M11 19l-7-7 7-7M18 19l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"}
                  />
                </svg>
              </button>
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = item.children 
                ? item.children.some(child => isActiveRoute(child.href))
                : isActiveRoute(item.href);

              if (item.children) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`flex-shrink-0 h-5 w-5 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span className={`ml-3 transition-opacity duration-300 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {item.name}
                      </span>
                      <svg
                        className={`ml-2 h-4 w-4 ms-auto transform transition-transform duration-200 text-slate-400 ${
                          openMenus[item.name] ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`transition-all duration-200 ${
                        openMenus[item.name] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-4 py-2 text-sm rounded-md ${
                              isActiveRoute(child.href)
                                ? 'text-white bg-slate-700'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className={`ml-3 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 