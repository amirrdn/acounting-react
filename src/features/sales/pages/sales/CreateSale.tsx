import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateSaleDTO, SaleItem } from '../../../../types/sales.types';
import { SalesService } from '../../../../services/sales.service';
import { Customer } from '../../../../types/Customer';
import { Product } from '../../../../types/Product';
import { customerService } from '@/api/customer/customer.api';
import { productService } from '@/api/product/product.api';
import { branchService } from '@/api/branch/branch.api';
import { Select } from 'antd';
import { Branch } from '../../../../types/Branch';
import { format } from 'date-fns';
import { message } from 'antd';

export const CreateSale: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateSaleDTO>({
    customer: {
      id: 0,
      name: ''
    },
    items: [],
    paymentMethod: 'cash',
    notes: '',
    branch: {
      id: 0,
      name: ''
    },
    receivableAccount: null,
    date: '',
    invoice_number: ''
  });
  const [currentItem, setCurrentItem] = useState<Omit<SaleItem, 'id' | 'salesInvoiceId'>>({
    quantity: 1,
    price: '0',
    total: '0',
    product: {
      id: 0,
      name: '',
      sku: '',
      price: '0',
      cost: '0',
      is_active: true,
      minimumStock: 0,
      createdAt: '',
      updatedAt: '',
      defaultSupplier: null
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [customersResponse, productsResponse, branchesResponse] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
          branchService.getAll()
        ]);
        setCustomers(customersResponse);
        setProducts(productsResponse.data);
        setBranches(branchesResponse);

        if (isEdit && id) {
          const saleData = await SalesService.getSaleById(id);
          setFormData({
            customer: {
              id: typeof saleData.customer === 'string' ? parseInt(saleData.customer) : saleData.customer.id,
              name: typeof saleData.customer === 'string' ? '' : saleData.customer.name
            },
            items: saleData.items || [],
            paymentMethod: saleData.paymentMethod || 'cash',
            notes: saleData.notes || '',
            branch: {
              id: saleData.branch.id,
              name: saleData.branch.name
            },
            receivableAccount: saleData.receivableAccount || null,
            date: format(new Date(saleData.createdAt), 'yyyy-MM-dd'),
            invoice_number: saleData.invoice_number || ''
          });
        }
      } catch (error) {
        message.error('Gagal mengambil data: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'branch') {
      const selectedBranch = branches.find(b => b.id.toString() === value.toString());
      if (selectedBranch) {
        setFormData(prev => ({
          ...prev,
          branch: {
            id: selectedBranch.id,
            name: selectedBranch.name
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCustomerChange = (value: string) => {
    const selectedCustomer = customers.find(c => c.id.toString() === value);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer: {
          id: selectedCustomer.id,
          name: selectedCustomer.name
        }
      }));
    }
  };

  const handleProductSelect = (productId: string) => {
    const selectedProduct = products.find(p => p.id.toString() === productId);
    if (selectedProduct) {
      setCurrentItem(prev => ({
        ...prev,
        quantity: 1,
        price: selectedProduct.price.toString(),
        total: selectedProduct.price.toString(),
        product: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          sku: selectedProduct.sku || '',
          price: selectedProduct.price.toString(),
          cost: selectedProduct.cost.toString(),
          is_active: selectedProduct.is_active,
          minimumStock: selectedProduct.minimumStock,
          createdAt: selectedProduct.createdAt || '',
          updatedAt: selectedProduct.updatedAt || '',
          defaultSupplier: selectedProduct.defaultSupplier || null
        }
      }));
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => {
      const updated = {
        ...prev,
        [name]: name === 'quantity' ? Number(value) : value
      };
      if (name === 'quantity') {
        updated.total = (Number(updated.price) * updated.quantity).toString();
      }
      return updated;
    });
  };

  const addItem = () => {
    if (!currentItem.product.name || !currentItem.price || currentItem.quantity < 1) {
      alert('Please fill in all item details');
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, currentItem]
    }));
    setCurrentItem({
      quantity: 1,
      price: '0',
      total: '0',
      product: {
        id: 0,
        name: '',
        sku: '',
        price: '0',
        cost: '0',
        is_active: true,
        minimumStock: 0,
        createdAt: '',
        updatedAt: '',
        defaultSupplier: null
      }
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await SalesService.updateSale(id, formData);
      } else {
        await SalesService.createSale(formData);
      }
      navigate('/sales');
    } catch (error) {
      message.error('Gagal menyimpan penjualan');
    }
  };

  const total = formData.items.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        {isEdit ? 'Edit Penjualan' : 'Buat Penjualan Baru'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Invoice</label>
              <input
                type="text"
                value={formData.invoice_number}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pelanggan</label>
            <Select
              className="w-full"
              placeholder="Pilih pelanggan"
              value={formData.customer.id.toString() || undefined}
              onChange={handleCustomerChange}
              style={{ height: '44px' }}
            >
              {customers.map(customer => (
                <Select.Option key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Tambah Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Select
              placeholder="Pilih Produk"
              value={currentItem.product.id.toString() || undefined}
              onChange={handleProductSelect}
              className="w-full"
            >
              {products.map(product => (
                <Select.Option key={product.id} value={product.id.toString()}>
                  {product.name} - Rp {product.price.toLocaleString()}
                </Select.Option>
              ))}
            </Select>
            <input
              type="number"
              placeholder="Jumlah"
              name="quantity"
              value={currentItem.quantity}
              onChange={handleItemChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              Harga: Rp {currentItem.price}
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              Subtotal: Rp {currentItem.total}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tambah Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left font-semibold text-gray-600">Produk</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Harga</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Jumlah</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Subtotal</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.product.name}</td>
                    <td className="p-3">Rp {parseFloat(item.price).toLocaleString()}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">Rp {parseFloat(item.total).toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xl font-bold text-right p-4 bg-blue-50 rounded-lg">
            Total: Rp {total.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Tunai</option>
              <option value="card">Kartu</option>
              <option value="transfer">Transfer Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabang</label>
            <select
              name="branch"
              value={formData.branch.id.toString()}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Pilih Cabang</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/sales')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Simpan Perubahan' : 'Buat Penjualan'}
          </button>
        </div>
      </form>
    </div>
  );
}; 