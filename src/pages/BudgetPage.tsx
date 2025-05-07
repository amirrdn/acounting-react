import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { budgetApi, Budget } from '@/api/budget/budget.api';

const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetApi.getAll();
      setBudgets(data);
    } catch (error) {
      message.error('Gagal mengambil data budget');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tahun',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? 'Aktif' : 'Tidak Aktif'),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Budget) => (
        <Button type="link" onClick={() => navigate(`/budget/${record.id}`)}>
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Daftar Budget"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/budget/new')}
          >
            Buat Budget
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={budgets}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default BudgetPage; 