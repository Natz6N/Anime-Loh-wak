import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroAnime {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
}

interface HeroCarouselProps {
  animes: HeroAnime[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ animes }) => {
  return (
    <div className="relative h-[70vh] min-h-[600px]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full"
      >
        {animes.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="relative h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${anime.bannerImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              </div>
              
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                      {anime.title}
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 line-clamp-3">
                      {anime.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={`/anime/${anime.id}`}
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Play size={20} className="mr-2" />
                        Watch Now
                      </Link>
                      <Link
                        to={`/anime/${anime.id}`}
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        <Info size={20} className="mr-2" />
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;