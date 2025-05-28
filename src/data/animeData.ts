import { Anime, Genre, PaginatedResult } from '../types/anime';

const generateEpisodes = (count: number, animeId: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${animeId}-ep-${i + 1}`,
    number: i + 1,
    title: `Episode ${i + 1}`,
    thumbnail: `https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=500`,
    duration: '24 min',
    releaseDate: new Date(2023, 0, i + 1).toISOString(),
  }));
};

const animeData: Anime[] = [
  {
    id: 'one-piece',
    title: 'One Piece',
    titleJapanese: 'ワンピース',
    image: 'https://images.pexels.com/photos/159868/lost-pirate-pirates-fantasy-159868.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/5698397/pexels-photo-5698397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named "One Piece".',
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    episodes: generateEpisodes(10, 'one-piece'),
    rating: 8.9,
    releaseYear: 1999,
    status: 'Ongoing',
    studio: 'Toei Animation',
    popularity: 1,
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    titleJapanese: '鬼滅の刃',
    image: 'https://images.pexels.com/photos/7347449/pexels-photo-7347449.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/7347449/pexels-photo-7347449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    genres: ['Action', 'Fantasy', 'Drama', 'Supernatural'],
    episodes: generateEpisodes(8, 'demon-slayer'),
    rating: 8.7,
    releaseYear: 2019,
    status: 'Ongoing',
    studio: 'ufotable',
    popularity: 2,
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    image: 'https://images.pexels.com/photos/34090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/34090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    genres: ['Action', 'Drama', 'Fantasy', 'Mystery'],
    episodes: generateEpisodes(12, 'attack-on-titan'),
    rating: 9.0,
    releaseYear: 2013,
    status: 'Completed',
    studio: 'Wit Studio',
    popularity: 3,
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    titleJapanese: '僕のヒーローアカデミア',
    image: 'https://images.pexels.com/photos/3800420/pexels-photo-3800420.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/3800420/pexels-photo-3800420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
    genres: ['Action', 'Comedy', 'Drama', 'Sci-Fi'],
    episodes: generateEpisodes(9, 'my-hero-academia'),
    rating: 8.4,
    releaseYear: 2016,
    status: 'Ongoing',
    studio: 'Bones',
    popularity: 4,
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    titleJapanese: '呪術廻戦',
    image: 'https://images.pexels.com/photos/2956376/pexels-photo-2956376.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/2956376/pexels-photo-2956376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    episodes: generateEpisodes(7, 'jujutsu-kaisen'),
    rating: 8.6,
    releaseYear: 2020,
    status: 'Ongoing',
    studio: 'MAPPA',
    popularity: 5,
  },
  {
    id: 'spy-x-family',
    title: 'Spy x Family',
    titleJapanese: 'スパイファミリー',
    image: 'https://images.pexels.com/photos/7232417/pexels-photo-7232417.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/7232417/pexels-photo-7232417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.',
    genres: ['Action', 'Comedy', 'Slice of Life'],
    episodes: generateEpisodes(6, 'spy-x-family'),
    rating: 8.5,
    releaseYear: 2022,
    status: 'Ongoing',
    studio: 'Wit Studio',
    popularity: 6,
  },
  {
    id: 'vinland-saga',
    title: 'Vinland Saga',
    titleJapanese: 'ヴィンランド・サガ',
    image: 'https://images.pexels.com/photos/5847584/pexels-photo-5847584.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/5847584/pexels-photo-5847584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'Thorfinn pursues a journey with his father\'s killer in order to take revenge and end his life in a duel as an honorable warrior and pay his father a homage.',
    genres: ['Action', 'Adventure', 'Drama', 'Historical'],
    episodes: generateEpisodes(5, 'vinland-saga'),
    rating: 8.8,
    releaseYear: 2019,
    status: 'Ongoing',
    studio: 'Wit Studio',
    popularity: 7,
  },
  {
    id: 'fullmetal-alchemist',
    title: 'Fullmetal Alchemist: Brotherhood',
    titleJapanese: '鋼の錬金術師',
    image: 'https://images.pexels.com/photos/4275885/pexels-photo-4275885.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/4275885/pexels-photo-4275885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms.',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    episodes: generateEpisodes(8, 'fullmetal-alchemist'),
    rating: 9.1,
    releaseYear: 2009,
    status: 'Completed',
    studio: 'Bones',
    popularity: 8,
  },
  {
    id: 'death-note',
    title: 'Death Note',
    titleJapanese: 'デスノート',
    image: 'https://images.pexels.com/photos/4348556/pexels-photo-4348556.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/4348556/pexels-photo-4348556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    genres: ['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
    episodes: generateEpisodes(7, 'death-note'),
    rating: 8.6,
    releaseYear: 2006,
    status: 'Completed',
    studio: 'Madhouse',
    popularity: 9,
  },
  {
    id: 'haikyuu',
    title: 'Haikyu!!',
    titleJapanese: 'ハイキュー!!',
    image: 'https://images.pexels.com/photos/10672837/pexels-photo-10672837.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/10672837/pexels-photo-10672837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'Determined to be like the volleyball championship\'s star player Shouyou, a short boy nicknamed "the small giant," joins his school\'s volleyball club.',
    genres: ['Comedy', 'Drama', 'Sports'],
    episodes: generateEpisodes(6, 'haikyuu'),
    rating: 8.7,
    releaseYear: 2014,
    status: 'Completed',
    studio: 'Production I.G',
    popularity: 10,
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    titleJapanese: 'チェンソーマン',
    image: 'https://images.pexels.com/photos/13438567/pexels-photo-13438567.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/13438567/pexels-photo-13438567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his crushing debts.',
    genres: ['Action', 'Horror', 'Supernatural'],
    episodes: generateEpisodes(9, 'chainsaw-man'),
    rating: 8.5,
    releaseYear: 2022,
    status: 'Ongoing',
    studio: 'MAPPA',
    popularity: 11,
  },
  {
    id: 'violet-evergarden',
    title: 'Violet Evergarden',
    titleJapanese: 'ヴァイオレット・エヴァーガーデン',
    image: 'https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg?auto=compress&cs=tinysrgb&w=600',
    bannerImage: 'https://images.pexels.com/photos/2103127/pexels-photo-2103127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    synopsis: 'In the aftermath of a great war, Violet Evergarden, a young female ex-soldier, gets a job at a writers\' agency and goes on assignments to create letters that can connect people.',
    genres: ['Drama', 'Fantasy', 'Slice of Life'],
    episodes: generateEpisodes(5, 'violet-evergarden'),
    rating: 8.9,
    releaseYear: 2018,
    status: 'Completed',
    studio: 'Kyoto Animation',
    popularity: 12,
  }
];

// Available genres from our anime data
export const availableGenres: Genre[] = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 
  'Supernatural', 'Thriller'
];

// Filter function
export const filterAnime = (
  searchTerm: string = '',
  selectedGenres: Genre[] = [],
  page: number = 1,
  limit: number = 6
): Promise<PaginatedResult<Anime>> => {
  // Filter by search term
  let filtered = animeData.filter(anime => 
    anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (anime.titleJapanese && anime.titleJapanese.includes(searchTerm))
  );
  
  // Filter by selected genres
  if (selectedGenres.length > 0) {
    filtered = filtered.filter(anime => 
      selectedGenres.every(genre => anime.genres.includes(genre))
    );
  }
  
  // Calculate pagination
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  // Return paginated result
  return Promise.resolve({
    data: paginatedData,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: endIndex < total
  });
};

// Get anime by ID
export const getAnimeById = (id: string): Promise<Anime | null> => {
  const anime = animeData.find(anime => anime.id === id) || null;
  return Promise.resolve(anime);
};

// Get popular anime
export const getPopularAnime = (limit: number = 6): Promise<Anime[]> => {
  return Promise.resolve(animeData.slice(0, limit));
};