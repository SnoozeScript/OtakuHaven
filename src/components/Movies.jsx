import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const query = searchParams.get("search");
        setSearchQuery(query); // Update the searchQuery state
        const url = query
          ? `${import.meta.env.VITE_API_BASE_URL}/search/movie?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }&query=${encodeURIComponent(query)}`
          : `${import.meta.env.VITE_API_BASE_URL}/movie/popular?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams]);

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
      {/* Search Result Message */}
      <h1 className="text-3xl font-bold mb-6 text-white">
        {searchQuery ? `Search Results for ${searchQuery}` : "Popular Movies"}
      </h1>
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
