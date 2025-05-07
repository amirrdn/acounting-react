import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Card, message, Switch, Table, Select } from 'antd';
import { budgetApi, CreateBudgetData } from '@/api/budget/budget.api';
import { accountService } from '@/api/account';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const BudgetNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<Array<{ accountId: number; monthlyAmounts: number[] }>>([]);
  const [accounts, setAccounts] = useState<Array<{ id: number; name: string }>>([]);

  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAll();
        setAccounts(data.data);
      } catch (error) {
        message.error('Gagal mengambil data akun');
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (values: CreateBudgetData) => {
    try {
      setLoading(true);
      const formattedDetails = details.map(detail => ({
        accountId: detail.accountId,
        januaryAmount: detail.monthlyAmounts[0] || 0,
        februaryAmount: detail.monthlyAmounts[1] || 0,
        marchAmount: detail.monthlyAmounts[2] || 0,
        aprilAmount: detail.monthlyAmounts[3] || 0,
        mayAmount: detail.monthlyAmounts[4] || 0,
        juneAmount: detail.monthlyAmounts[5] || 0,
        julyAmount: detail.monthlyAmounts[6] || 0,
        augustAmount: detail.monthlyAmounts[7] || 0,
        septemberAmount: detail.monthlyAmounts[8] || 0,
        octoberAmount: detail.monthlyAmounts[9] || 0,
        novemberAmount: detail.monthlyAmounts[10] || 0,
        decemberAmount: detail.monthlyAmounts[11] || 0
      }));
      
      await budgetApi.create({
        ...values,
        details: formattedDetails
      });
      message.success('Budget berhasil dibuat');
      navigate('/budget');
    } catch (error) {
      message.error('Gagal membuat budget');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetail = () => {
    setDetails([...details, { 
      accountId: 0, 
      monthlyAmounts: Array(12).fill(0)
    }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...details];
    if (field === 'accountId') {
      newDetails[index].accountId = value;
    } else if (field === 'monthlyAmounts') {
      newDetails[index].monthlyAmounts = value;
    }
    setDetails(newDetails);
  };

  const columns = [
    {
      title: 'Akun',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (value: number, _record: any, index: number) => (
        <Select
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => handleDetailChange(index, 'accountId', val)}
        >
          {accounts.map(account => (
            <Select.Option key={account.id} value={account.id}>
              {account.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'monthlyAmounts',
      key: 'monthlyAmounts',
      render: (amounts: number[], _record: any, index: number) => (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map((month, monthIndex) => (
              <div key={monthIndex}>
                <div className="text-xs text-gray-500">{month}</div>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => Number(value!.replace(/Rp\s?|(,*)/g, ''))}
                  value={amounts[monthIndex]}
                  onChange={(val) => {
                    const newAmounts = [...amounts];
                    newAmounts[monthIndex] = val || 0;
                    handleDetailChange(index, 'monthlyAmounts', newAmounts);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500">Total</div>
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => Number(value!.replace(/Rp\s?|(,*)/g, ''))}
              value={amounts.reduce((a, b) => a + b, 0)}
              readOnly
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: unknown, __: unknown, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveDetail(index)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card title="Buat Budget Baru">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            year: new Date().getFullYear(),
            isActive: true,
          }}
        >
          <Form.Item
            name="name"
            label="Nama Budget"
            rules={[{ required: true, message: 'Nama budget harus diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="year"
            label="Tahun"
            rules={[{ required: true, message: 'Tahun harus diisi' }]}
          >
            <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Deskripsi"
            rules={[{ required: true, message: 'Deskripsi harus diisi' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktif" unCheckedChildren="Tidak Aktif" />
          </Form.Item>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Detail Budget</h3>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddDetail}
              >
                Tambah Detail
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={details}
              rowKey={(record) => `detail-${record.accountId}`}
              pagination={false}
            />
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Simpan
            </Button>
            <Button className="ml-2" onClick={() => navigate('/budget')}>
              Batal
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BudgetNewPage; 