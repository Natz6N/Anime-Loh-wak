import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import AnimeService from '../services/animeService';
import { Anime, Genre, PaginatedResult } from '../types/anime';

const GenresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenre = searchParams.get('genre') as Genre | null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [animeResults, setAnimeResults] = useState<PaginatedResult<Anime>>({
    data: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false
  });
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load all genres
  useEffect(() => {
    setAllGenres(AnimeService.getGenres());
  }, []);
  
  // Fetch anime by genre
  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      setIsLoading(true);
      try {
        if (selectedGenre) {
          const results = await AnimeService.searchAnime(
            '',
            [selectedGenre],
            page,
            12
          );
          setAnimeResults(results);
        } else {
          setAnimeResults({
            data: [],
            total: 0,
            currentPage: 1,
            totalPages: 0,
            hasNextPage: false
          });
        }
      } catch (error) {
        console.error('Error fetching anime by genre:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnimeByGenre();
  }, [selectedGenre, page]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // SEO data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': selectedGenre ? `${selectedGenre} Anime` : 'Anime Genres',
    'description': selectedGenre 
      ? `Browse anime in the ${selectedGenre} genre` 
      : 'Browse anime by genre categories',
    'url': 'https://animestream.example.com/genres'
  };
  
  return (
    <Layout>
      <SEO 
        title={selectedGenre ? `${selectedGenre} Anime` : 'Anime Genres'} 
        description={selectedGenre 
          ? `Discover the best ${selectedGenre} anime shows. Browse our collection of ${selectedGenre} titles.` 
          : 'Browse anime by genre categories. Find your favorite shows organized by genre.'}
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {selectedGenre ? `${selectedGenre} Anime` : 'Browse by Genre'}
        </h1>
        
        {!selectedGenre ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allGenres.map((genre) => (
              <Link 
                key={genre}
                to={`/genres?genre=${encodeURIComponent(genre)}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <h3 className="text-lg font-medium text-gray-900">{genre}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Explore {genre} titles
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  to="/genres"
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  ← All Genres
                </Link>
                <span className="text-lg text-gray-600">
                  Showing {selectedGenre} anime
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <LoadingSpinner size="large" className="py-20" />
            ) : (
              <>
                {animeResults.data.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      No anime found in the {selectedGenre} genre
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Try selecting a different genre to find anime.
                    </p>
                    <Link
                      to="/genres"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Browse all genres
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {animeResults.data.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                )}
                
                <Pagination
                  currentPage={animeResults.currentPage}
                  totalPages={animeResults.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default GenresPage;