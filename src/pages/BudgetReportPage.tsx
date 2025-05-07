import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Table, message } from 'antd';
import { Line } from '@ant-design/plots';
import { budgetApi, Budget, BudgetDetail } from '@/api/budget/budget.api';

interface BudgetReport extends Budget {
  details: (BudgetDetail & {
    actualAmounts: number[];
  })[];
}

const BudgetReportPage: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetReport[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, [selectedYear]);

  useEffect(() => {
    if (budgets.length > 0) {
      const uniqueAccounts = budgets[0].details.map(detail => detail.account);
      setAccounts(uniqueAccounts);
      if (uniqueAccounts.length > 0 && !selectedAccount) {
        setSelectedAccount(uniqueAccounts[0].id);
      }
    }
  }, [budgets]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetApi.getReport(selectedYear);
      setBudgets(data as BudgetReport[]);
    } catch (error) {
      message.error('Gagal mengambil laporan anggaran: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyAmounts = (detail: BudgetDetail) => [
    detail.januaryAmount,
    detail.februaryAmount,
    detail.marchAmount,
    detail.aprilAmount,
    detail.mayAmount,
    detail.juneAmount,
    detail.julyAmount,
    detail.augustAmount,
    detail.septemberAmount,
    detail.octoberAmount,
    detail.novemberAmount,
    detail.decemberAmount
  ];

  const getChartData = () => {
    if (!selectedAccount || budgets.length === 0) return [];

    const detail = budgets[0].details.find(d => d.account.id === selectedAccount);
    if (!detail) return [];

    return [
      {
        name: 'Budget',
        data: getMonthlyAmounts(detail).map((amount, index) => ({
          month: index + 1,
          value: amount,
        })),
      },
      {
        name: 'Actual',
        data: detail.actualAmounts.map((amount, index) => ({
          month: index + 1,
          value: amount,
        })),
      },
    ];
  };

  const columns = [
    {
      title: 'Bulan',
      dataIndex: 'month',
      key: 'month',
      render: (month: number) => {
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[month - 1];
      },
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (amount: number) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      render: (amount: number) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: 'Varians',
      key: 'variance',
      render: (_text: string, record: any) => {
        const variance = record.actual - record.budget;
        return (
          <span className={variance < 0 ? 'text-red-500' : 'text-green-500'}>
            Rp {variance.toLocaleString()}
          </span>
        );
      },
    },
  ];

  const tableData = () => {
    if (!selectedAccount || budgets.length === 0) return [];

    const detail = budgets[0].details.find(d => d.account.id === selectedAccount);
    if (!detail) return [];

    const monthlyAmounts = getMonthlyAmounts(detail);
    const actualAmounts = Array.isArray(detail.actualAmounts) ? detail.actualAmounts : [];

    return monthlyAmounts.map((budget: number, index: number) => ({
      key: index,
      month: index + 1,
      budget,
      actual: actualAmounts[index] || 0,
    }));
  };

  return (
    <div className="p-6">
      <Card title="Laporan Budget" className="mb-4">
        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              value={selectedYear}
              onChange={setSelectedYear}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: new Date().getFullYear() - i,
                label: new Date().getFullYear() - i,
              }))}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              value={selectedAccount}
              onChange={setSelectedAccount}
              options={accounts.map(account => ({
                value: account.id,
                label: account.name,
              }))}
            />
          </Col>
        </Row>

        <Line
          data={getChartData()}
          xField="month"
          yField="value"
          seriesField="name"
          point={{
            size: 5,
            shape: 'diamond',
          }}
          label={{
            style: {
              fill: '#aaa',
            },
          }}
        />
      </Card>

      <Card title="Detail Per Bulan">
        <Table
          columns={columns}
          dataSource={tableData()}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default BudgetReportPage; 