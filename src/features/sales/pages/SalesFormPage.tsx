import React from 'react';
import { useParams } from 'react-router-dom';

const SalesFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div>
      <h1>{isEdit ? 'Edit Penjualan' : 'Tambah Penjualan'}</h1>
    </div>
  );
};

export default SalesFormPage; 