import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimeDetail from './pages/AnimeDetail';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Genre from './pages/Genres';
import Search from './pages/Search';
// Uncomment when ready to implement
// import AnimeList from './components/AnimeList';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id/:episode/:dub?/:skip?" element={<AnimeDetail />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/genre/:genre" element={<Genre />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
};

export default App;
