
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Manga from './components/Manga';
import AnimeDetails from './components/AnimeDetail';
import TvShows from './components/TvShows'
import Movies from './components/Movies'
import Anime from './components/Anime';
import MovieDetail from './components/MovieDetail';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App