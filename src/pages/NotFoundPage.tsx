import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Page Not Found" 
        description="The page you are looking for does not exist."
      />
      
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-500">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Search size={20} />
              Search Anime
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;