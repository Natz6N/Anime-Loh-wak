import React from 'react';
import { X } from 'lucide-react';
import { Genre } from '../types/anime';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: Genre[];
  onGenreToggle: (genre: Genre) => void;
  onClearFilters: () => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onGenreToggle,
  onClearFilters
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Filter by Genre</h2>
        {selectedGenres.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreToggle(genre)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedGenres.includes(genre)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      
      {selectedGenres.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Active filters:</span>{' '}
            {selectedGenres.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;