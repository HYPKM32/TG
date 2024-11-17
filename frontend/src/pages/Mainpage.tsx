import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your App</h1>
      <p className="text-lg mb-8">This is the main page of your application.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your main page content here */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Feature 1</h2>
          <p className="mb-4">Description of feature 1</p>
          <Link to="/feature1" className="text-blue-500 hover:text-blue-600">
            Learn More →
          </Link>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Feature 2</h2>
          <p className="mb-4">Description of feature 2</p>
          <Link to="/feature2" className="text-blue-500 hover:text-blue-600">
            Learn More →
          </Link>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Feature 3</h2>
          <p className="mb-4">Description of feature 3</p>
          <Link to="/feature3" className="text-blue-500 hover:text-blue-600">
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;