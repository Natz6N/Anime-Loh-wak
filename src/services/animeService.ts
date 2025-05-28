import { Anime, Genre, PaginatedResult } from '../types/anime';
import { filterAnime, getAnimeById, getPopularAnime, availableGenres } from '../data/animeData';

// Service wrapper for anime data functions
const AnimeService = {
  // Get popular anime for homepage
  getPopularAnime: async (limit: number = 6): Promise<Anime[]> => {
    try {
      return await getPopularAnime(limit);
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      return [];
    }
  },
  
  // Get a specific anime by its ID
  getAnimeById: async (id: string): Promise<Anime | null> => {
    try {
      return await getAnimeById(id);
    } catch (error) {
      console.error(`Error fetching anime with id ${id}:`, error);
      return null;
    }
  },
  
  // Search and filter anime
  searchAnime: async (
    searchTerm: string = '',
    selectedGenres: Genre[] = [],
    page: number = 1,
    limit: number = 6
  ): Promise<PaginatedResult<Anime>> => {
    try {
      return await filterAnime(searchTerm, selectedGenres, page, limit);
    } catch (error) {
      console.error('Error searching anime:', error);
      return {
        data: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false
      };
    }
  },
  
  // Get all available genres
  getGenres: (): Genre[] => {
    return availableGenres;
  }
};

export default AnimeService;