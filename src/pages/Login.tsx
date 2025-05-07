import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Username atau password salah');
    }
  };

  const testUsers = [
    { email: 'admin@example.com', password: 'password123', role: 'Admin' },
    { email: 'surya@gmail.com', password: 'password123', role: 'Purchase' },
    { email: 'sandi@gmail.com', password: 'password123', role: 'Manager' },
    { email: 'santi@gmail.com', password: 'password123', role: 'Sales' },
    { email: 'saras@gmail.com', password: 'password123', role: 'Finance' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke Akun Anda
          </h2>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Info Login:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Admin: admin@example.com / password123</li>
              <li>• Purchase: surya@gmail.com / password123</li>
              <li>• Manager: sandi@gmail.com / password123</li>
              <li>• Sales: santi@gmail.com / password123</li>
              <li>• Finance: saras@gmail.com / password123</li>
            </ul>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Masuk
            </button>
          </div>
        </form>

        {/* Test Credentials Card */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Test Credentials</h3>
          <div className="space-y-3">
            {testUsers.map((user, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{user.role}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Password: <span className="font-mono">{user.password}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            Gunakan salah satu akun di atas untuk login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 