import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 z-10">
            <span className="text-xl md:text-2xl font-bold text-purple-500">OtakuHaven</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-between items-center ml-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search here..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Desktop Menu Links */}
            <div className="flex space-x-6 ml-8">
              <Link to="/anime" className="hover:text-purple-500 transition-colors">Anime</Link>
              <Link to="/manga" className="hover:text-purple-500 transition-colors">Manga</Link>
              <Link to="/movies" className="hover:text-purple-500 transition-colors">Movies</Link>
              <Link to="/tvshows" className="hover:text-purple-500 transition-colors">TV Shows</Link>
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-400" />
              ) : (
                <Menu className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? 'max-h-24 pb-4' : 'max-h-0'
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-50' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4">
            <Link
              to="/anime"
              className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Anime
            </Link>
            <Link
              to="/manga"
              className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Manga
            </Link>
            <Link
              to="/movies"
              className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/manga"
              className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              TV Shows
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;