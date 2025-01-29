import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Film, BookOpen, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [category, setCategory] = useState("anime");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.includes("anime")) setCategory("anime");
    else if (pathSegments.includes("manga")) setCategory("manga");
    else if (pathSegments.includes("movies") || pathSegments[0] === "movie")
      setCategory("movies");
    else if (pathSegments.includes("tvshows") || pathSegments[0] === "tv-show")
      setCategory("tvshows");
    else setCategory("anime");
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${category}?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <motion.nav
      className="bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 shadow-xl sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                OtakuHaven
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-between items-center ml-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${category}...`}
                    className="w-full px-4 py-2 rounded-xl bg-gray-800/80 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  />
                </motion.div>
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-5 w-5 text-purple-400" />
                </button>
              </form>
            </div>

            {/* Desktop Links */}
            <div className="flex space-x-6 ml-8">
              {[
                { name: "Anime", path: "/anime", icon: Film },
                { name: "Manga", path: "/manga", icon: BookOpen },
                { name: "Movies", path: "/movies", icon: Film },
                { name: "TV Shows", path: "/tvshows", icon: Tv },
              ].map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-800/50 to-indigo-800/50 hover:from-purple-700/50 hover:to-indigo-700/50 transition-all"
                  >
                    <link.icon className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-100">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-4 md:hidden">
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-800/50 rounded-lg"
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5 text-purple-400" />
            </motion.button>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-800/50 rounded-lg"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-purple-400" />
              ) : (
                <Menu className="h-6 w-6 text-purple-400" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              key="mobile-search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="md:hidden overflow-hidden"
            >
              <form onSubmit={handleSearch} className="relative pb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${category}...`}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/80 backdrop-blur-sm text-white focus:outline-none border border-gray-700"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-5 w-5 text-purple-400" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="md:hidden absolute w-full left-0 bg-gray-900/95 backdrop-blur-sm"
              style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
            >
              <div className="flex flex-col space-y-2 pb-4 px-4">
                {[
                  { name: "Anime", path: "/anime", icon: Film },
                  { name: "Manga", path: "/manga", icon: BookOpen },
                  { name: "Movies", path: "/movies", icon: Film },
                  { name: "TV Shows", path: "/tvshows", icon: Tv },
                ].map((link) => (
                  <motion.div
                    key={link.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gray-800/80 hover:bg-gray-700/50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <link.icon className="h-5 w-5 text-purple-400" />
                      <span className="text-gray-100">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;