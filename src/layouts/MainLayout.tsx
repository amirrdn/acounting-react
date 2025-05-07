import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/layout/Breadcrumb';
import { useSidebarStore } from '../store/sidebarStore';

const MainLayout = () => {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            isOpen ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-20'
          }`}
        >
          <div className="p-2 sm:p-4 mt-16 min-h-[calc(100vh-4rem)] flex flex-col max-w-full overflow-x-hidden">
            <div className="mb-2 px-2 sm:px-4 pb-7">
              <Breadcrumb />
            </div>
            <div className="flex-1 max-w-full overflow-x-hidden px-2 sm:px-4 mb-16">
              <Outlet />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 