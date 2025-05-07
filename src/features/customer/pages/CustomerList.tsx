import React, { useEffect, useState } from 'react';
import { Customer } from '@/api/customer/customer.api';
import { customerService } from '@/api/customer/customer.api';
import { Link } from 'react-router-dom';
import { Button, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      message.error('Gagal mengambil data pelanggan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await customerService.delete(id);
      message.success('Pelanggan berhasil dihapus');
      setCustomers(customers.filter(customer => customer.id !== id));
    } catch (error) {
      message.error('Gagal menghapus pelanggan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telepon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'NPWP',
      dataIndex: 'taxNumber',
      key: 'taxNumber',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Link to={`/customers/edit/${record.id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Customer</h1>
        <Link to="/customers/new">
          <Button type="primary">Tambah Customer</Button>
        </Link>
      </div>
      
      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table 
          columns={columns} 
          dataSource={customers} 
          loading={loading}
          rowKey="id"
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">Email:</span>
                    <span className="text-gray-900">{customer.email || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">Telp:</span>
                    <span className="text-gray-900">{customer.phone || '-'}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-gray-500 w-16">Alamat:</span>
                    <span className="text-gray-900 flex-1">{customer.address || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">NPWP:</span>
                    <span className="text-gray-900">{customer.taxNumber || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Link to={`/customers/edit/${customer.id}`}>
                    <Button type="primary" size="small">Edit</Button>
                  </Link>
                  <Button 
                    danger 
                    size="small"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerList; 