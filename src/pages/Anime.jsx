import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchAnime } from "../api";
import AnimeCard from "../components/AnimeCard";
import { Loader2 } from "lucide-react";

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
          format
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
    setSearchParams(prev => {
      if (value) {
        prev.set(filterType, value);
      } else {
        prev.delete(filterType);
      }
      // Reset to page 1 when filters change
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
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
          className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayMessage = genre
    ? `Results for "${query}" in "${genre}" genre:`
    : `Results for "${query}"`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <select
          value={sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="p-2 rounded bg-gray-700"
        >
          <option value="POPULARITY_DESC">Popular</option>
          <option value="SCORE_DESC">Top Rated</option>
          <option value="TRENDING_DESC">Trending</option>
          <option value="START_DATE_DESC">Newest</option>
        </select>

        <select
          value={genre}
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          className="p-2 rounded bg-gray-700"
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
          className="p-2 rounded bg-gray-700"
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
          className="p-2 rounded bg-gray-700"
        >
          <option value="">All Years</option>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={2024 - i}>
              {2024 - i}
            </option>
          ))}
        </select>

        <select
          value={format}
          onChange={(e) => handleFilterChange("format", e.target.value)}
          className="p-2 rounded bg-gray-700"
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
      <h2 className="text-xl font-bold mb-4">{displayMessage}</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Anime Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page - 2 + i;
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded ${
                        page === pageNum ? "bg-purple-500" : "bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Anime;