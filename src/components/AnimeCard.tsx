import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, className = '' }) => {
  return (
    <Link 
      to={`/anime/${anime.id}`} 
      className={`group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        <img
          src={anime.image}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm text-white line-clamp-2">
              {anime.synopsis}
            </p>
          </div>
        </div>
        
        <div className="absolute top-2 left-2 flex items-center space-x-1 rounded-full bg-black/60 px-2 py-1">
          <Star size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-white">{anime.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-1 text-lg font-medium text-gray-900 line-clamp-1">{anime.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{anime.releaseYear}</span>
          <span>{anime.status}</span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {anime.genres.slice(0, 3).map((genre) => (
            <span 
              key={genre} 
              className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;