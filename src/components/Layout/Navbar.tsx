import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, FilmIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md px-4 sm:px-6 lg:px-8 ${
        isScrolled ? 'bg-white/100 shadow-lg' : 'bg-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FilmIcon className="h-8 w-8 text-red-600" />
            <span className="font-extrabold text-xl text-gray-900">Natz</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Browse', 'Popular', 'Jadwal', 'Genre List'].map((item, idx) => (
              <Link
                key={idx}
                to={`/${item.toLowerCase().replace(/ /g, '')}`}
                className="text-gray-800 hover:text-red-600 transition-colors font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-4 pr-10 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-4 space-y-4">
            {['Home', 'Browse', 'Genres'].map((item, idx) => (
              <Link
                key={idx}
                to={`/${item.toLowerCase()}`}
                className="block py-2 text-gray-800 hover:text-red-600 transition-colors"
              >
                {item}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-4 pr-10 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
