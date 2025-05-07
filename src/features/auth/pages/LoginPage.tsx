import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-y-auto">
      <div className="min-h-full w-full flex items-center justify-center p-4">
        <div className="w-full max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Info Login Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">Info Login Testing</h2>
              <div className="space-y-4 lg:space-y-6">
                {[
                  { role: 'Admin', email: 'admin@example.com', password: 'password123', color: 'bg-indigo-500' },
                  { role: 'Purchase', email: 'surya@gmail.com', password: 'password123', color: 'bg-purple-500' },
                  { role: 'Manager', email: 'sandi@gmail.com', password: 'password123', color: 'bg-pink-500' },
                  { role: 'Sales', email: 'santi@gmail.com', password: 'password123', color: 'bg-blue-500' },
                  { role: 'Finance', email: 'saras@gmail.com', password: 'password123', color: 'bg-teal-500' },
                ].map((user, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 ${user.color} rounded-xl flex items-center justify-center text-white text-lg lg:text-xl font-bold`}>
                        {user.role.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-base lg:text-lg font-semibold truncate">{user.role}</h3>
                        <p className="text-white/80 text-sm lg:text-base truncate">{user.email}</p>
                      </div>
                      <div className="text-white/60 text-sm lg:text-base">
                        {user.password}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-2xl">
              <div className="space-y-6 lg:space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 lg:h-12 lg:w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">
                    Selamat Datang
                  </h2>
                  <p className="text-gray-600 mt-2 lg:mt-3 text-base lg:text-lg">
                    Silakan masukkan kredensial Anda untuk melanjutkan
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                  <div className="space-y-4 lg:space-y-6">
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 text-base lg:text-lg"
                    />
                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 text-base lg:text-lg"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 lg:p-4 border border-red-200">
                      <p className="text-sm lg:text-base text-red-700 text-center">{error}</p>
                    </div>
                  )}

                  <div className="pt-2 lg:pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 lg:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-base lg:text-lg"
                    >
                      Masuk
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;