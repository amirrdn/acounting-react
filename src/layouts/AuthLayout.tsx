import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Accounting System
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 