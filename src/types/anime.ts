export type Genre = 
  | 'Action' 
  | 'Adventure' 
  | 'Comedy' 
  | 'Drama' 
  | 'Fantasy' 
  | 'Horror' 
  | 'Mystery' 
  | 'Romance' 
  | 'Sci-Fi' 
  | 'Slice of Life' 
  | 'Sports' 
  | 'Supernatural' 
  | 'Thriller';

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  releaseDate: string;
}

export interface Anime {
  id: string;
  title: string;
  titleJapanese?: string;
  image: string;
  bannerImage?: string;
  synopsis: string;
  genres: Genre[];
  episodes: AnimeEpisode[];
  rating: number;
  releaseYear: number;
  status: 'Ongoing' | 'Completed';
  studio: string;
  popularity: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}