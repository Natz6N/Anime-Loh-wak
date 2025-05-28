import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AnimeCard from '../components/AnimeCard';
import GenreFilter from '../components/GenreFilter';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import AnimeService from '../services/animeService';
import { Anime, Genre, PaginatedResult } from '../types/anime';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [searchResults, setSearchResults] = useState<PaginatedResult<Anime>>({
    data: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Load genres
  useEffect(() => {
    setAvailableGenres(AnimeService.getGenres());
    
    // Parse genres from URL
    const genreParam = searchParams.get('genres');
    if (genreParam) {
      const genres = genreParam.split(',') as Genre[];
      setSelectedGenres(genres);
    }
  }, [searchParams]);
  
  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults({
          data: [],
          total: 0,
          currentPage: 1,
          totalPages: 0,
          hasNextPage: false
        });
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await AnimeService.searchAnime(
          searchQuery,
          selectedGenres,
          page,
          12
        );
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching anime:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery, selectedGenres, page]);
  
  // Toggle genre selection
  const handleGenreToggle = (genre: Genre) => {
    setSelectedGenres((prevGenres) => {
      const newGenres = prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre];
      
      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      if (newGenres.length > 0) {
        newParams.set('genres', newGenres.join(','));
      } else {
        newParams.delete('genres');
      }
      newParams.set('page', '1'); // Reset to page 1 when changing filters
      setSearchParams(newParams);
      
      return newGenres;
    });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSelectedGenres([]);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('genres');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };
  
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
    '@type': 'SearchResultsPage',
    'name': searchQuery ? `Search results for "${searchQuery}"` : 'Search Anime',
    'description': searchQuery 
      ? `Find anime titles matching "${searchQuery}"`
      : 'Search for your favorite anime shows',
    'url': 'https://animestream.example.com/search'
  };
  
  return (
    <Layout>
      <SEO 
        title={searchQuery ? `Search: ${searchQuery}` : 'Search Anime'} 
        description={searchQuery 
          ? `Find anime titles matching "${searchQuery}"`
          : 'Search for your favorite anime shows and discover new content.'}
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Search Results: "${searchQuery}"` : 'Search Anime'}
          </h1>
          <SearchBar 
            fullWidth 
            initialValue={searchQuery}
            placeholder="Find your favorite anime..." 
          />
        </div>
        
        {!searchQuery ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Enter a search term to find anime
            </h2>
            <p className="text-gray-600">
              Try searching for titles, genres, or keywords to discover new anime.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with filters */}
            <div className="lg:col-span-1">
              <GenreFilter
                genres={availableGenres}
                selectedGenres={selectedGenres}
                onGenreToggle={handleGenreToggle}
                onClearFilters={handleClearFilters}
              />
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <LoadingSpinner size="large\" className="py-20" />
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {searchResults.total === 0 
                        ? 'No results found' 
                        : `Found ${searchResults.total} results`}
                    </p>
                  </div>
                  
                  {searchResults.data.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">No results found</h2>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search term or filters to find what you're looking for.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.data.map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} />
                      ))}
                    </div>
                  )}
                  
                  <Pagination
                    currentPage={searchResults.currentPage}
                    totalPages={searchResults.totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;