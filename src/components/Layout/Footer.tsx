import React from 'react';
import { Link } from 'react-router-dom';
import { FilmIcon, Heart, Github, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <FilmIcon className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">AnimeStream</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Your destination for the best anime content. Stream your favorite shows and discover new titles from our extensive collection.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white transition-colors">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-gray-400 hover:text-white transition-colors">
                  Genres
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  DMCA
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400">
            © {currentYear} AnimeStream. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0 text-gray-400 flex items-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> for anime fans
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;