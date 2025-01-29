import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TVShowCard from "../components/TVShowCard";
import { motion } from "framer-motion";
import { Loader2, Filter, Clock, TrendingUp } from "lucide-react";

const GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
];

const TIME_WINDOWS = {
  day: "Today",
  week: "This Week",
};

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

const TVShows = () => {
  const [tvShows, setTVShows] = useState([]);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        const query = searchParams.get("search");
        setSearchQuery(query);

        let url;
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (query) {
          url = `${baseUrl}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(
            query
          )}`;
        } else {
          const platform = PLATFORMS[activeSection];

          if (platform.endpoint === "trending") {
            url = `${baseUrl}/trending/tv/${timeWindow}?api_key=${apiKey}`;
          } else if (platform.endpoint === "discover") {
            url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_watch_providers=${platform.providerId}&watch_region=US`;
          } else {
            url = `${baseUrl}/tv/${platform.endpoint}?api_key=${apiKey}`;
          }

          if (selectedGenre && platform.endpoint !== "trending") {
            url += `&with_genres=${selectedGenre}`;
          }

          if (platform.endpoint === "discover") {
            url += "&sort_by=popularity.desc&include_adult=false&page=1";
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch TV shows");
        }
        const data = await response.json();
        setTVShows(data.results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [searchParams, activeSection, selectedGenre, timeWindow]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "trending") {
      setSelectedGenre("");
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

  const handleTVShowSelect = (id, season = 1, episode = 1) => {
    navigate(`/tv-show/${id}/${season}/${episode}`);
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
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 min-h-screen">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-full md:w-auto flex flex-wrap gap-2">
            {Object.entries(PLATFORMS).map(([key, platform]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSectionChange(key)}
                className={`px-4 py-2 text-sm rounded-xl transition-all ${
                  activeSection === key
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-100 hover:bg-gray-700/50"
                } flex-1 sm:flex-none`}
              >
                {platform.name}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {PLATFORMS[activeSection].needsTimeWindow && (
              <div className="relative w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    setIsTimeWindowDropdownOpen(!isTimeWindowDropdownOpen)
                  }
                  className="w-full px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 flex items-center justify-between transition-all"
                >
                  <span className="text-gray-100 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    {TIME_WINDOWS[timeWindow]}
                  </span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </motion.button>

                {isTimeWindowDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-2 w-full bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700"
                  >
                    {Object.entries(TIME_WINDOWS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleTimeWindowChange(key)}
                        className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {!PLATFORMS[activeSection].needsTimeWindow && (
              <div className="relative w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="w-full px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 flex items-center justify-between transition-all"
                >
                  <span className="text-gray-100">
                    {selectedGenre
                      ? GENRES.find((g) => g.id.toString() === selectedGenre)
                          ?.name
                      : "Select Genre"}
                  </span>
                  <Filter className="w-4 h-4 text-purple-400" />
                </motion.button>

                {isGenreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-2 w-full bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700"
                  >
                    <button
                      onClick={() => handleGenreChange("")}
                      className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700/50 transition-colors rounded-t-xl"
                    >
                      All Genres
                    </button>
                    {GENRES.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreChange(genre.id.toString())}
                        className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700/50 transition-colors last:rounded-b-xl"
                      >
                        {genre.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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

      {tvShows.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
        >
          {tvShows.map((show) => (
            <motion.div
              key={show.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center "
            >
              <TVShowCard
                tvShow={show}
                onSelect={() => handleTVShowSelect(show.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center text-gray-400 mt-8">
          No TV shows found. Try adjusting your filters or search term.
        </div>
      )}
    </div>
  );
};

export default TVShows;
