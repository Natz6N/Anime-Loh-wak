import React from 'react';
import { Play, Clock } from 'lucide-react';
import { AnimeEpisode } from '../types/anime';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Episodes</h2>
      
      <div className="space-y-4">
        {episodes.map((episode) => (
          <div 
            key={episode.id}
            className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
          >
            {/* Episode Thumbnail */}
            <div className="relative sm:w-48 h-32">
              <img 
                src={episode.thumbnail} 
                alt={`${episode.title} Thumbnail`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  className="bg-blue-500 text-white p-3 rounded-full"
                  aria-label="Play episode"
                >
                  <Play size={20} fill="white" />
                </button>
              </div>
            </div>
            
            {/* Episode Details */}
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Episode {episode.number}
                  </span>
                  <h3 className="text-lg font-medium mt-1">{episode.title}</h3>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock size={14} className="mr-1" />
                  {episode.duration}
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Released: {new Date(episode.releaseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;