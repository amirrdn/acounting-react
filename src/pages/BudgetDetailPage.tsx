import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, InputNumber, Select, message, Card, Row, Col, Typography, Divider, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { budgetApi, Budget, BudgetDetail, CreateBudgetDetailData } from '@/api/budget/budget.api';
import { accountService } from '@/api/account';

const { Title, Text } = Typography;

interface Account {
  id: number;
  name: string;
}

const BudgetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [details, setDetails] = useState<BudgetDetail[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm<CreateBudgetDetailData>();

  useEffect(() => {
    if (id) {
      fetchBudget();
      fetchAccounts();
    }
  }, [id]);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const data = await budgetApi.getById(parseInt(id!));
      setBudget(data);
      setDetails(data.details || []);
    } catch (error) {
      message.error('Gagal mengambil data budget');
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await accountService.getAll();
      setAccounts(response.data);
    } catch (error) {
      message.error('Gagal mengambil data akun');
    }
  };

  const handleCreate = async (values: CreateBudgetDetailData) => {
    try {
      await budgetApi.createDetail(parseInt(id!), values);
      message.success('Detail budget berhasil ditambahkan');
      setModalVisible(false);
      form.resetFields();
      fetchBudget();
    } catch (error) {
      message.error('Gagal menambahkan detail budget');
    }
  };

  const handleDeleteDetail = async (detailId: number) => {
    try {
      await budgetApi.deleteDetail(Number(id), detailId);
      fetchBudget();
    } catch (error) {
      message.error('Gagal menghapus detail budget');
    }
  };

  const getMonthlyAmount = (detail: BudgetDetail, month: string) => {
    const amount = detail[`${month}Amount` as keyof BudgetDetail];
    return amount ? parseFloat(String(amount)) : 0;
  };

  const getTotalAmount = (detail: BudgetDetail) => {
    return parseFloat(String(detail.totalAmount || 0));
  };

  const getMonthlyTotal = (month: string) => {
    return details.reduce((sum, detail) => sum + getMonthlyAmount(detail, month), 0);
  };

  const getGrandTotal = () => {
    return details.reduce((sum, detail) => sum + getTotalAmount(detail), 0);
  };

  const months = [
    { key: 'january', label: 'Januari' },
    { key: 'february', label: 'Februari' },
    { key: 'march', label: 'Maret' },
    { key: 'april', label: 'April' },
    { key: 'may', label: 'Mei' },
    { key: 'june', label: 'Juni' },
    { key: 'july', label: 'Juli' },
    { key: 'august', label: 'Agustus' },
    { key: 'september', label: 'September' },
    { key: 'october', label: 'Oktober' },
    { key: 'november', label: 'November' },
    { key: 'december', label: 'Desember' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/budget')}
          className="mb-4"
        >
          Kembali
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <Row gutter={24}>
          <Col span={8}>
            <div className="mb-2">
              <Text type="secondary">Nama Budget</Text>
            </div>
            <Title level={4} className="mt-0">{budget?.name}</Title>
          </Col>
          <Col span={8}>
            <div className="mb-2">
              <Text type="secondary">Tahun</Text>
            </div>
            <Title level={4} className="mt-0">{budget?.year}</Title>
          </Col>
          <Col span={8}>
            <div className="mb-2">
              <Text type="secondary">Status</Text>
            </div>
            <div>
              <Tag color={budget?.isActive ? 'success' : 'error'}>
                {budget?.isActive ? 'Aktif' : 'Tidak Aktif'}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <Title level={4} className="mb-0">Detail Budget</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Tambah Detail
        </Button>
      </div>

      <div className="space-y-4">
        {details.map((detail) => (
          <Card key={detail.id} className="shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Title level={5} className="mb-0">{detail.account.name}</Title>
                <Text type="secondary">Total: Rp {getTotalAmount(detail).toLocaleString('id-ID')}</Text>
              </div>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeleteDetail(detail.id)}
              />
            </div>
            
            <Divider className="my-4" />
            
            <Row gutter={16}>
              {months.map((month) => (
                <Col span={6} key={month.key} className="mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <Text type="secondary" className="block mb-1">{month.label}</Text>
                    <Text strong>Rp {getMonthlyAmount(detail, month.key).toLocaleString('id-ID')}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        ))}

        {details.length > 0 && (
          <Card className="shadow-sm bg-gray-50">
            <Title level={5} className="mb-4">Total Keseluruhan</Title>
            <Row gutter={16}>
              {months.map((month) => (
                <Col span={6} key={month.key} className="mb-4">
                  <div className="bg-white p-3 rounded">
                    <Text type="secondary" className="block mb-1">{month.label}</Text>
                    <Text strong>Rp {getMonthlyTotal(month.key).toLocaleString('id-ID')}</Text>
                  </div>
                </Col>
              ))}
            </Row>
            <Divider className="my-4" />
            <div className="text-right">
              <Text strong className="text-lg">
                Total: Rp {getGrandTotal().toLocaleString('id-ID')}
              </Text>
            </div>
          </Card>
        )}
      </div>

      <Modal
        title="Tambah Detail Budget"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="accountId"
            label="Akun"
            rules={[{ required: true, message: 'Akun harus dipilih' }]}
          >
            <Select placeholder="Pilih akun">
              {accounts.map(account => (
                <Select.Option key={account.id} value={account.id}>
                  {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            {months.map((month, _index) => (
              <div key={month.key}>
                <div className="text-xs text-gray-500 mb-1">{month.label}</div>
                <Form.Item
                  name={`${month.key}Amount`}
                  rules={[{ required: true, message: `${month.label} harus diisi` }]}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/Rp\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </div>
            ))}
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BudgetDetailPage; 