import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const TVShowDetail = () => {
  const { id } = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShowDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await response.json();

        const seasonResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${currentSeason}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const seasonData = await seasonResponse.json();
        const currentEpisodeData = seasonData.episodes.find(
          (ep) => ep.episode_number === currentEpisode
        );

        setTVShow({
          ...data,
          season: seasonData,
          currentEpisode: currentEpisodeData,
        });
      } catch (error) {
        console.error("Failed to fetch TV show details:", error);
      }
    };

    fetchTVShowDetail();
  }, [id, currentSeason, currentEpisode]);

  if (!tvShow) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  const videoUrl = `https://vidsrc.icu/embed/tv/${id}/${currentSeason}/${currentEpisode}`;

  const handleSeasonChange = (season) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
    navigate(`/tv-show/${id}/${season}/1`);
  };

  const handleEpisodeChange = (episode) => {
    setCurrentEpisode(episode);
    navigate(`/tv-show/${id}/${currentSeason}/${episode}`);
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 1) {
      handleEpisodeChange(currentEpisode - 1);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisode < tvShow.season.episodes.length) {
      handleEpisodeChange(currentEpisode + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            title={tvShow.name}
          ></iframe>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handlePrevEpisode}
              disabled={currentEpisode === 1}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-500"
            >
              Prev
            </button>
            <span className="px-4 py-2 bg-gray-700 rounded text-white">
              Season {currentSeason} Ep: {currentEpisode}
            </span>
            <button
              onClick={handleNextEpisode}
              disabled={currentEpisode === tvShow.season.episodes.length}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-500"
            >
              Next
            </button>
          </div>

          {/* Season Selector */}
          <h2 className="text-2xl font-bold mb-4">Season</h2>
          <select
            value={currentSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {[...Array(tvShow.number_of_seasons)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Season {index + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Episode Selector */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>

          <div className="grid grid-cols-8 gap-2">
            {tvShow.season.episodes.map((episode) => (
              <button
                key={episode.episode_number}
                onClick={() => handleEpisodeChange(episode.episode_number)}
                className={`p-2 rounded ${
                  currentEpisode === episode.episode_number
                    ? "bg-purple-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {episode.episode_number}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <img
          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          alt={tvShow.name}
          className="w-full rounded-lg mb-4 shadow-md"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/450";
          }}
        />
        <h1 className="text-2xl font-bold mb-2">{tvShow.name}</h1>
        {tvShow.tagline && (
          <p className="text-gray-400 italic mb-4">{tvShow.tagline}</p>
        )}
        <div className="space-y-3 text-gray-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Rating:</span>
            <span className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              {tvShow.vote_average?.toFixed(1)}/10
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">First Air Date:</span>
            <span>{new Date(tvShow.first_air_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Current Season:</span>
            <span>Season {tvShow.season.season_number}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Current Episode:</span>
            <span>Episode {tvShow.currentEpisode.episode_number}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-6 lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-gray-300 leading-relaxed">{tvShow.overview}</p>
      </div>
    </div>
  );
};

export default TVShowDetail;
