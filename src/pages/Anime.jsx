import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchAnime } from "../api";
import AnimeCard from "../components/AnimeCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 24;

const Anime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all search parameters with defaults
  const query = searchParams.get("search") || "Naruto";
  const genre = searchParams.get("genre") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "POPULARITY_DESC";
  const season = searchParams.get("season") || "";
  const year = searchParams.get("year") || "";
  const format = searchParams.get("format") || "";

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await searchAnime({
          query,
          genre,
          page,
          perPage: ITEMS_PER_PAGE,
          sort,
          season,
          year,
          format,
        });

        setAnimeList(response.media);
        setTotalPages(Math.ceil(response.pageInfo.total / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching anime:", error);
        setError("Failed to fetch anime. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(filterType, value);
      } else {
        prev.delete(filterType);
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayMessage = query
    ? `Search Results for "${query}"`
    : "Popular Anime";

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 min-h-screen">
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <select
          value={sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="p-2.5 text-sm rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="POPULARITY_DESC">Popular</option>
          <option value="SCORE_DESC">Top Rated</option>
          <option value="TRENDING_DESC">Trending</option>
          <option value="START_DATE_DESC">Newest</option>
        </select>

        <select
          value={genre}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          className="p-2.5 text-sm rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Genres</option>
          <option value="ACTION">Action</option>
          <option value="COMEDY">Comedy</option>
          <option value="DRAMA">Drama</option>
          <option value="ROMANCE">Romance</option>
          <option value="FANTASY">Fantasy</option>
        </select>

        <select
          value={season}
          onChange={(e) => handleFilterChange("season", e.target.value)}
          className="p-2.5 text-sm rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Seasons</option>
          <option value="WINTER">Winter</option>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="FALL">Fall</option>
        </select>

        <select
          value={year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="p-2.5 text-sm rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Years</option>
          {/* Add year options dynamically if needed */}
        </select>

        <select
          value={format}
          onChange={(e) => handleFilterChange("format", e.target.value)}
          className="p-2.5 text-sm rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Formats</option>
          <option value="TV">TV</option>
          <option value="MOVIE">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
          <option value="SPECIAL">Special</option>
        </select>
      </div>

      {/* Search Result Message */}
      <h1 className="text-2xl font-bold mb-6 text-gray-100 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {displayMessage}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Anime Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            {animeList.map((anime) => (
              <motion.div
                key={anime.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <AnimeCard anime={anime} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                Previous
              </motion.button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page - 2 + i;
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 text-sm rounded-xl border ${
                        page === pageNum
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent"
                          : "bg-gray-800/50 border-gray-700 text-gray-100 hover:bg-gray-700/50"
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                }
                return null;
              })}

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                Next
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Anime;