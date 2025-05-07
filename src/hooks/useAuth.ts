import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '@/api/api';

export const useAuth = () => {
  const { isAuthenticated, user, logout, setUser, setToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    logout,
    login,
  };
}; 