import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import AnimeService from '../services/animeService';
import { Anime, Genre } from '../types/anime';

const GenrePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<{ genre: Genre; count: number }[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>(searchParams.get('letter') || 'all');
  const [isLoading, setIsLoading] = useState(true);

  // Generate alphabet array
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  useEffect(() => {
    const fetchGenreCounts = async () => {
      setIsLoading(true);
      try {
        const allGenres = AnimeService.getGenres();
        const genreCounts = await Promise.all(
          allGenres.map(async (genre) => {
            const results = await AnimeService.searchAnime('', [genre], 1, 1);
            return {
              genre,
              count: results.total
            };
          })
        );
        
        setGenres(genreCounts.sort((a, b) => a.genre.localeCompare(b.genre)));
      } catch (error) {
        console.error('Error fetching genre counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenreCounts();
  }, []);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const newParams = new URLSearchParams(searchParams);
    if (letter === 'all') {
      newParams.delete('letter');
    } else {
      newParams.set('letter', letter);
    }
    setSearchParams(newParams);
  };

  const filteredGenres = genres.filter(({ genre }) => 
    selectedLetter === 'all' || genre.startsWith(selectedLetter)
  );

  // SEO data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Anime Genres',
    'description': 'Browse anime by genres. Find your favorite anime categorized by genre.',
    'url': 'https://animestream.example.com/genre'
  };

  return (
    <Layout>
      <SEO 
        title="Anime Genres" 
        description="Browse anime by genre. Discover new series across different categories including action, romance, comedy, and more."
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse by Genre</h1>

        {/* Alphabet Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLetterClick('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedLetter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner size="large" className="py-20" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGenres.map(({ genre, count }) => (
              <a
                key={genre}
                href={`/genres?genre=${encodeURIComponent(genre)}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/${
                      Math.floor(Math.random() * 1000000) + 1000
                    }/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600`}
                    alt={`${genre} anime`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{genre}</h2>
                      <p className="text-sm text-gray-200">{count} Anime</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenrePage;