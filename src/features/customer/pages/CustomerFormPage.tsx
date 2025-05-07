import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;

  return (
    <div>
      <h1>{isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h1>
    </div>
  );
};

export default CustomerFormPage; 