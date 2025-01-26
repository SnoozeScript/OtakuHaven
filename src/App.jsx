import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react'; // Import Lucide icon
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Manga from './pages/Manga';
import AnimeDetails from './components/AnimeDetail';
import TvShows from './pages/TvShows';
import Movies from './pages/Movies';
import Anime from './pages/Anime';
import MovieDetail from './components/MovieDetail';
import ScrollingMessage from './ScrollingMessage';
import TVShowDetail from './components/TVShowDetail';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 transition-opacity duration-300">
      <button
        onClick={scrollToTop}
        className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transform transition-all duration-300 ease-in-out 
        bg-gradient-to-br from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700 
        p-3 rounded-full shadow-lg hover:shadow-xl
        border border-white/10 hover:border-white/20
        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 text-white stroke-[3]" />
        <span className="sr-only">Back to top</span>
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <ScrollingMessage />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/tv-show/:id/:season?/:episode?" element={<TVShowDetail />} />
        </Routes>
        <Footer />
        <ScrollToTopButton />
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
  );
};

export default App;