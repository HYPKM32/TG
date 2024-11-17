import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/" className="text-blue-500 hover:text-blue-600">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;