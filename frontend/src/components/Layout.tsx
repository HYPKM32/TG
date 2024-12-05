import { Link, Outlet } from 'react-router-dom';
import { logout } from '../api/client';

const Layout = () => {
  const userId = localStorage.getItem('userId');

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload(); // 로그아웃 후 페이지 새로고침
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-7">
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
                <Link to="/about" className="text-gray-800 hover:text-blue-500">About</Link>
              </div>
            </div>
            {userId && (
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Log-out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;