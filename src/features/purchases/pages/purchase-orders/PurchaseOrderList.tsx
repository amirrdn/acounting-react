import { message } from 'antd';

try {
 
} catch (error) {
  message.error('Gagal mengambil data pesanan pembelian: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'));
}
