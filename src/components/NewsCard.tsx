import React from 'react';
import { Calendar } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  image: string;
  date: string;
  description: string;
  url: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar size={16} className="mr-1" />
          {new Date(news.date).toLocaleDateString()}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {news.description}
        </p>
        <a
          href={news.url}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read More
        </a>
      </div>
    </article>
  );
};

export default NewsCard;