import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center">
          © 2024 Your App Name
        </div>
      </footer>
    </div>
  );
};

export default Layout;