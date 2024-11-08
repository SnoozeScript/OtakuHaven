import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";
import { Loader2,Filter, Clock, TrendingUp } from "lucide-react";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
];

const TIME_WINDOWS = {
  day: "Today",
  week: "This Week",
};

// Updated platform configurations with trending options
// Updated platform configurations with additional streaming services
const PLATFORMS = {
  trending: {
    name: "Trending",
    endpoint: "trending",
    needsTimeWindow: true,
  },
  netflix: {
    name: "Netflix",
    providerId: 8,
    endpoint: "discover",
  },
  prime: {
    name: "Amazon Prime",
    providerId: 9,
    endpoint: "discover",
  },
  disney: {
    name: "Disney+",
    providerId: 337,
    endpoint: "discover",
  },
  apple: {
    name: "Apple TV+",
    providerId: 350,
    endpoint: "discover",
  },
  hulu: {
    name: "Hulu",
    providerId: 15,
    endpoint: "discover",
  },
  paramount: {
    name: "Paramount+",
    providerId: 531,
    endpoint: "discover",
  },
  peacock: {
    name: "Peacock",
    providerId: 386,
    endpoint: "discover",
  },
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("trending");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [timeWindow, setTimeWindow] = useState("day");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isTimeWindowDropdownOpen, setIsTimeWindowDropdownOpen] =
    useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const query = searchParams.get("search");
        setSearchQuery(query);

        let url;
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (query) {
          // Search endpoint
          url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            query
          )}`;
        } else {
          const platform = PLATFORMS[activeSection];

          if (platform.endpoint === "trending") {
            // Trending movies endpoint
            url = `${baseUrl}/trending/movie/${timeWindow}?api_key=${apiKey}`;
          } else if (platform.endpoint === "discover") {
            // Streaming platform filtering using discover endpoint
            url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_watch_providers=${platform.providerId}&watch_region=US`;
          } else {
            // Regular endpoints (popular, top_rated)
            url = `${baseUrl}/movie/${platform.endpoint}?api_key=${apiKey}`;
          }

          // Add genre filter if selected (except for trending)
          if (selectedGenre && platform.endpoint !== "trending") {
            url += `&with_genres=${selectedGenre}`;
          }

          // Additional parameters for better results
          if (platform.endpoint === "discover") {
            url += "&sort_by=popularity.desc&include_adult=false&page=1";
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
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
  }, [searchParams, activeSection, selectedGenre, timeWindow]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "trending") {
      setSelectedGenre(""); // Reset genre for trending
    }
    setSearchParams({});
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setIsGenreDropdownOpen(false);
  };

  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    setIsTimeWindowDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
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
      {/* Navigation and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Platform Tabs */}
          <div className="w-full sm:w-auto">
            <div className="inline-flex rounded-lg bg-gray-800 p-1 w-full sm:w-auto">
              {Object.entries(PLATFORMS).map(([key, platform]) => (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`
                    px-4 py-2 text-sm rounded-md transition-colors duration-200
                    ${
                      activeSection === key
                        ? "bg-purple-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }
                    flex-1 sm:flex-none whitespace-nowrap
                  `}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Time Window Dropdown (only for trending) */}
            {PLATFORMS[activeSection].needsTimeWindow && (
              <div className="relative flex-1 sm:flex-initial">
                <button
                  onClick={() =>
                    setIsTimeWindowDropdownOpen(!isTimeWindowDropdownOpen)
                  }
                  className="w-full px-4 py-2 text-left bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {TIME_WINDOWS[timeWindow]}
                  </span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </button>

                {isTimeWindowDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div className="py-1">
                      {Object.entries(TIME_WINDOWS).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleTimeWindowChange(key)}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Genre Dropdown (hidden for trending) */}
            {!PLATFORMS[activeSection].needsTimeWindow && (
              <div className="relative flex-1 sm:flex-initial">
                <button
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="w-full px-4 py-2 text-left bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-300">
                    {selectedGenre
                      ? GENRES.find((g) => g.id.toString() === selectedGenre)
                          ?.name
                      : "Select Genre"}
                  </span>
                  <Filter className="w-4 h-4 text-gray-400" />
                </button>

                {isGenreDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => handleGenreChange("")}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                      >
                        All Genres
                      </button>
                      {GENRES.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => handleGenreChange(genre.id.toString())}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Title */}
      <h1 className="text-3xl font-bold mb-6 text-white">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : `${PLATFORMS[activeSection].name}${
              activeSection === "trending"
                ? ` ${TIME_WINDOWS[timeWindow]}`
                : selectedGenre
                ? ` - ${
                    GENRES.find((g) => g.id.toString() === selectedGenre)?.name
                  }`
                : ""
            }`}
      </h1>

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center text-gray-400 mt-8">
          No movies found. Try adjusting your filters or search term.
        </div>
      )}
    </div>
  );
};

export default Movies;
