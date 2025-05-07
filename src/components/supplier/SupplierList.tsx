import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Supplier } from '../../types/supplier';
import { supplierService } from '@/api/supplier';
import { useNavigate } from 'react-router-dom';

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      message.error('Gagal memuat data supplier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await supplierService.delete(id.toString());
      message.success('Supplier berhasil dihapus');
      fetchSuppliers();
    } catch (error) {
      message.error('Gagal menghapus supplier');
    }
  };

  const columns = [
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
      dataIndex: 'npwp',
      key: 'npwp',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: unknown, record: Supplier) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/suppliers/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Supplier</h1>
        <Button type="primary" onClick={() => navigate('/suppliers/new')}>
          Tambah Supplier
        </Button>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={suppliers}
          loading={loading}
          rowKey="id"
        />
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center">Memuat...</div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">Email:</span>
                    <span className="text-gray-900">{supplier.email || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">Telp:</span>
                    <span className="text-gray-900">{supplier.phone || '-'}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-gray-500 w-16">Alamat:</span>
                    <span className="text-gray-900 flex-1">{supplier.address || '-'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-16">NPWP:</span>
                    <span className="text-gray-900">{supplier.npwp || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(supplier.id)}
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

export default SupplierList;
