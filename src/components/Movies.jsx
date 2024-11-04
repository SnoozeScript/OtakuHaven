import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import { motion } from 'framer-motion';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('search');
        
        let url;
        if (query) {
          url = `${import.meta.env.VITE_API_BASE_URL}/search/movie?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&query=${encodeURIComponent(query)}`;
        } else {
          url = `${import.meta.env.VITE_API_BASE_URL}/movie/popular?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        setMovies(data.results);
        setSearchQuery(query || '');
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col justify-center items-center h-64">
          {/* Loading Spinner */}
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          
          {/* Loading Text */}
          <motion.div
            className="mt-4 text-purple-500 font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            Loading, please wait...
          </motion.div>
        </div>
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            name="search"
            placeholder="Search movies..."
            className="px-4 py-2 rounded-l-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-96"
            defaultValue={searchQuery}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded-r-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Search
          </button>
        </div>
      </form>

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-8">
          No movies found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Movies;