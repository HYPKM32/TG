import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Your App Name
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/about' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;