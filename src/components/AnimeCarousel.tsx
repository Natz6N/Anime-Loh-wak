// AnimeCarousel.tsx - Fixed version
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import AnimeCard from './AnimeCard';
import { Anime } from '../types/anime';

interface AnimeCarouselProps {
  title: string;
  animes: Anime[];
  viewAllLink?: string;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({
  title,
  animes,
  viewAllLink
}) => {
  return (
    <div className="relative py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </a>
        )}
      </div>
      
      <div className="carousel-container relative">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={10}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 7 },
          }}
        >
          {animes.map((anime) => (
            <SwiperSlide key={anime.id}>
              <AnimeCard anime={anime} />
            </SwiperSlide>
          ))}
        </Swiper>
        
        <button
          className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 carousel-container-hover:opacity-100 transition-opacity"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 carousel-container-hover:opacity-100 transition-opacity"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default AnimeCarousel;
