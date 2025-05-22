# Accounting System Frontend

Ini adalah frontend dari Sistem Akuntansi & Manajemen Bisnis berbasis web yang modern, dibangun menggunakan React, TypeScript, dan Ant Design. Sistem ini dirancang untuk membantu bisnis dalam mengelola keuangan, persediaan, pembelian, penjualan, dan laporan secara terintegrasi.

## ✨ Demo

Lihat demo aplikasi di sini:  
[https://frontendaccounting.vercel.app/](https://acounting-react.vercel.app/)

## 🚀 Fitur Utama

- **Dashboard Interaktif**: Ringkasan keuangan, aktivitas, dan statistik bisnis.
- **Manajemen Akun & Jurnal**: Input transaksi, laporan keuangan, dan pengelolaan akun.
- **Manajemen Pelanggan & Supplier**: CRUD data pelanggan dan pemasok.
- **Manajemen Produk & Stok**: Pengelolaan produk, stok, transfer, dan penyesuaian.
- **Pembelian & Penjualan**: Proses purchase order, sales order, faktur, dan pembayaran.
- **Manajemen Kas & Bank**: Pencatatan transaksi kas/bank dan rekonsiliasi.
- **Role-based Access Control**: Hak akses pengguna sesuai peran.
- **Audit Trail**: Riwayat perubahan data.
- **Responsive Design**: Tampilan optimal di desktop dan mobile.

## 🛠️ Teknologi

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vite](https://vitejs.dev/) (jika digunakan)

## 📦 Instalasi & Menjalankan Lokal

1. **Clone repository**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Buat file konfigurasi environment**
   - Salin `.env.example` ke `.env` dan sesuaikan endpoint API backend.

4. **Jalankan aplikasi**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Akses aplikasi**
   - Buka [http://localhost:5173](http://localhost:5173) di browser.

## 📁 Struktur Folder

```
src/
├── components/      # Komponen UI reusable
├── features/        # Modul bisnis (customer, supplier, sales, dll)
├── layouts/         # Layout utama dan otentikasi
├── pages/           # Routing halaman
├── api/             # Service API
├── store/           # State management
├── types/           # Tipe data TypeScript
└── ...
```

## 📝 Kontribusi

Kontribusi sangat terbuka! Silakan buat issue atau pull request untuk perbaikan dan penambahan fitur.

## 📄 Lisensi

MIT License

---

> Demo: [https://frontendaccounting.vercel.app/](https://frontendaccounting.vercel.app/)
