import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight, Play, Calendar, Clock, Star,Clapperboard } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const TVShowDetail = () => {
  const { id } = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [selectedEndpoint, setSelectedEndpoint] = useState("vidsrc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShowDetail = async () => {
      try {
        const [showResponse, seasonResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/season/${currentSeason}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
        ]);

        const [showData, seasonData] = await Promise.all([
          showResponse.json(),
          seasonResponse.json()
        ]);

        const currentEpisodeData = seasonData.episodes.find(
          (ep) => ep.episode_number === currentEpisode
        );

        setTVShow({
          ...showData,
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

  const endpoints = {
    vidsrc: `https://vidsrc.icu/embed/tv/${id}/${currentSeason}/${currentEpisode}`,
    multi: `https://player.autoembed.cc/embed/tv/${id}/${currentSeason}/${currentEpisode}`,
  };

  const handleSeasonChange = (season) => {
    setCurrentSeason(season);
    setCurrentEpisode(1);
    navigate(`/tv-show/${id}/${season}/1`);
  };

  const handleEpisodeChange = (episode) => {
    setCurrentEpisode(episode);
    navigate(`/tv-show/${id}/${currentSeason}/${episode}`);
  };

  const handlePrevEpisode = () => currentEpisode > 1 && handleEpisodeChange(currentEpisode - 1);
  const handleNextEpisode = () => currentEpisode < tvShow.season.episodes.length && handleEpisodeChange(currentEpisode + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Backdrop Gradient */}
      <div className="absolute inset-0 -z-10 max-h-[600px] overflow-hidden opacity-15">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
        <img 
          src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="relative pt-[56.25%] bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <iframe
              src={endpoints[selectedEndpoint]}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title={tvShow.name}
            />
          </div>

          {/* Player Controls */}
          <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevEpisode}
                  disabled={currentEpisode === 1}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextEpisode}
                  disabled={currentEpisode === tvShow.season.episodes.length}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2">
                {Object.keys(endpoints).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedEndpoint === key
                        ? "bg-purple-600 shadow-purple-glow"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <span className="font-semibold">
                S{currentSeason.toString().padStart(2, '0')} • 
                E{currentEpisode.toString().padStart(2, '0')}
              </span>
              <span className="text-gray-400">
                {tvShow.season.episodes[currentEpisode - 1]?.name}
              </span>
            </div>
          </div>

          {/* Season/Episode Selectors */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-400" />
                Select Season
              </h2>
              <select
                value={currentSeason}
                onChange={(e) => handleSeasonChange(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              >
                {[...Array(tvShow.number_of_seasons)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Season {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Episodes (Season {currentSeason})
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {tvShow.season.episodes.map((episode) => (
                  <button
                    key={episode.episode_number}
                    onClick={() => handleEpisodeChange(episode.episode_number)}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      currentEpisode === episode.episode_number
                        ? "bg-purple-600 scale-105"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {episode.episode_number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Show Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
              className="w-full rounded-xl mb-6 shadow-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => (e.target.src = "/api/placeholder/300/450")}
            />

            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {tvShow.name}
              </h1>
              
              {tvShow.tagline && (
                <p className="text-gray-400 italic text-lg">
                  &#34;{tvShow.tagline}&#34;
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <span className="font-semibold">{tvShow.vote_average?.toFixed(1)}/10</span>
                    <span className="text-gray-400 ml-2 text-sm">
                      ({tvShow.vote_count?.toLocaleString()} votes)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">First Air Date</p>
                    <p className="font-medium">
                      {new Date(tvShow.first_air_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-purple-400" />
              Overview
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {tvShow.overview || "No overview available..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetail;