import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HeroCarousel from '../components/HeroCarousel';
import AnimeCarousel from '../components/AnimeCarousel';
import NewsCard from '../components/NewsCard';
import SEO from '../components/SEO';
import AnimeService from '../services/animeService';
import { Anime, Genre } from '../types/anime';
import AnimeCard from '../components/AnimeCard';

const HomePage: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [latestAnime, setLatestAnime] = useState<Anime[]>([]);
  const [animeByGenre, setAnimeByGenre] = useState<Record<Genre, Anime[]>>({} as Record<Genre, Anime[]>);
  
  useEffect(() => {
    const fetchData = async () => {
      const popular = await AnimeService.getPopularAnime(10);
      setPopularAnime(popular);
      
      // Fetch latest anime
      const latest = await AnimeService.searchAnime('', [], 1, 20);
      setLatestAnime(latest.data);
      
      // Fetch anime by genre
      const genres = AnimeService.getGenres();
      const genreData: Record<Genre, Anime[]> = {} as Record<Genre, Anime[]>;
      
      for (const genre of genres) {
        const results = await AnimeService.searchAnime('', [genre], 1, 10);
        genreData[genre] = results.data;
      }
      
      setAnimeByGenre(genreData);
    };
    
    fetchData();
  }, []);
  
  // Mock news data
  const newsItems = [
    {
      id: '1',
      title: 'Demon Slayer Season 4 Announcement',
      image: 'https://images.pexels.com/photos/7347449/pexels-photo-7347449.jpeg',
      date: '2024-03-15',
      description: 'The highly anticipated fourth season of Demon Slayer has been officially announced, with a scheduled release date in Spring 2024.',
      url: '#'
    },
    {
      id: '2',
      title: 'One Piece Manga Reaches Chapter 1100',
      image: 'https://images.pexels.com/photos/159868/lost-pirate-pirates-fantasy-159868.jpeg',
      date: '2024-03-14',
      description: 'Eiichiro Oda\'s One Piece manga series continues to break records as it reaches its 1100th chapter milestone.',
      url: '#'
    },
    {
      id: '3',
      title: 'Attack on Titan Wins Anime of the Year',
      image: 'https://images.pexels.com/photos/34090/pexels-photo.jpg',
      date: '2024-03-13',
      description: 'The final season of Attack on Titan has been crowned Anime of the Year at the annual Anime Awards ceremony.',
      url: '#'
    }
  ];
  
  // SEO data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AnimeStream',
    'url': 'https://animestream.example.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://animestream.example.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
  
  return (
    <Layout>
      <SEO 
        title="Watch Anime Online" 
        description="Stream the latest and most popular anime shows. Discover new series and enjoy your favorites on AnimeStream."
        structuredData={structuredData}
      />
      
      {/* Hero Carousel */}
      <HeroCarousel 
        animes={popularAnime.slice(0, 5).map(anime => ({
          id: anime.id,
          title: anime.title,
          description: anime.synopsis,
          bannerImage: anime.bannerImage || anime.image
        }))}
      />
      
      {/* Popular Anime */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimeCarousel
          title="Most Popular"
          animes={popularAnime}
          viewAllLink="/browse?sort=popularity"
        />
        
        {/* Latest Updates */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
            <Link
              to="/browse"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Browse All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {latestAnime.slice(0, 10).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
        
        {/* Genre Sections */}
        {Object.entries(animeByGenre).map(([genre, animes]) => (
          <AnimeCarousel
            key={genre}
            title={genre}
            animes={animes}
            viewAllLink={`/genres?genre=${encodeURIComponent(genre)}`}
          />
        ))}
        
        {/* News Section */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;