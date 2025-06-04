import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, Tag } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import EpisodeList from '../components/EpisodeList';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import AnimeService from '../services/animeService';
import { Anime } from '../types/anime';

const AnimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [relatedAnime, setRelatedAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const animeData = await AnimeService.getAnimeById(id);
          setAnime(animeData);
          
          // Get related anime with similar genres
          if (animeData) {
            const related = await AnimeService.searchAnime(
              '',
              animeData.genres.slice(0, 2) as any,
              1,
              4 
            );
            // Filter out the current anime
            setRelatedAnime(related.data.filter(a => a.id !== id));
          }
        } catch (error) {
          console.error('Error fetching anime:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAnime();
    // Scroll to top when anime changes
    window.scrollTo(0, 0);
  }, [id]);
  
  // SEO data
  const generateStructuredData = (anime: Anime) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'TVSeries',
      'name': anime.title,
      'alternateName': anime.titleJapanese,
      'image': anime.image,
      'description': anime.synopsis,
      'genre': anime.genres,
      'datePublished': anime.releaseYear.toString(),
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': anime.rating,
        'bestRating': '10',
        'worstRating': '1',
      },
      'numberOfEpisodes': anime.episodes.length,
      'productionCompany': {
        '@type': 'Organization',
        'name': anime.studio
      }
    };
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }
  
  if (!anime) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Anime Not Found</h1>
          <p className="text-gray-600 mb-8">The anime you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/browse" 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Browse Anime
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <SEO 
        title={anime.title} 
        description={anime.synopsis}
        imageUrl={anime.image}
        structuredData={generateStructuredData(anime)}
      />
      
      {/* Hero Banner */}
      <div 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${anime.bannerImage || anime.image})`,
          backgroundPosition: 'center 20%' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute inset-0 px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {anime.title}
            </h1>
            {anime.titleJapanese && (
              <p className="text-gray-300 text-lg mb-4">{anime.titleJapanese}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img 
                src={anime.image} 
                alt={anime.title} 
                className="w-full object-cover"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 mr-2" size={20} />
                <span className="text-lg font-bold">{anime.rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">/10</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-gray-500 mr-3 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Release Year</p>
                    <p className="font-medium">{anime.releaseYear}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-gray-500 mr-3 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{anime.status}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Tag className="text-gray-500 mr-3 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Studio</p>
                    <p className="font-medium">{anime.studio}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/genres?genre=${encodeURIComponent(genre)}`}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Synopsis and Episodes */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-700 leading-relaxed">{anime.synopsis}</p>
            </div>
            
            <EpisodeList episodes={anime.episodes} />
          </div>
        </div>
        
        {/* Related Anime */}
        {relatedAnime.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnimePage;