import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import TVShowCard from "./TVShowCard";
import { useSearchParams, useNavigate } from "react-router-dom";

const TVShows = () => {
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const query = searchParams.get("search");
        const url = query
          ? `https://api.themoviedb.org/3/search/tv?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }&query=${encodeURIComponent(query)}`
          : `https://api.themoviedb.org/3/tv/popular?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`;

        const response = await fetch(url);
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
  }, [searchParams]);

  const handleTVShowSelect = (id, season, episode) => {
    navigate(`/tv-show/${id}/${season}/${episode}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          <div className="mt-4 text-purple-500 font-semibold text-lg">
            Loading, please wait...
          </div>
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
      <h1 className="text-3xl font-bold mb-6 text-white">Popular TV Shows</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tvShows.map((tvShow) => (
          <TVShowCard
            key={tvShow.id}
            tvShow={tvShow}
            onSelect={() =>
              handleTVShowSelect(tvShow.id, tvShow.season_number, tvShow.episode_number)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default TVShows;