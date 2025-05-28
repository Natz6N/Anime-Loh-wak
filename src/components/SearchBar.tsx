import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  fullWidth?: boolean;
  className?: string;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  fullWidth = false,
  className = '',
  placeholder = 'Search for anime...',
  initialValue = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  return (
    <form 
      onSubmit={handleSearch} 
      className={`${fullWidth ? 'w-full' : 'max-w-md'} ${className}`}
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 pl-5 pr-14 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;