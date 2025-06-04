import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import AnimePage from './pages/AnimePage';
import SearchPage from './pages/SearchPage';
import GenresPage from './pages/GenresPage';
import GenrePage from './pages/GenrePage';
import NotFoundPage from './pages/NotFoundPage';
import AnimeCardss from './pages/TestPage';
import VideoPlayer from './pages/Videoplayer';
import AnimeCommentsSystem from './pages/showAnime';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/anime/:id" element={<AnimePage />} />
      <Route path="/anime/ids" element={<AnimeCommentsSystem />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/genres" element={<GenresPage />} />
      <Route path="/genre" element={<GenrePage />} />
      <Route path="/test" element={<AnimeCardss />} />
      <Route path="/videotest" element={<VideoPlayer />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App; 