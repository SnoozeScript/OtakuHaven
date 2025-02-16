import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Star,
  Clapperboard,
  Tv2,
  Users,
  Film,
} from "lucide-react";

const TVShowDetail = () => {
  const { id, season: paramSeason, episode: paramEpisode } = useParams();
  const [tvShow, setTVShow] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(Number(paramSeason) || 1);
  const [currentEpisode, setCurrentEpisode] = useState(
    Number(paramEpisode) || 1
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState("vidsrc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTVShowDetail = async () => {
      try {
        const [showResponse, seasonResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/${currentSeason}?api_key=${
              import.meta.env.VITE_TMDB_API_KEY
            }`
          ),
        ]);

        const [showData, seasonData] = await Promise.all([
          showResponse.json(),
          seasonResponse.json(),
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
    Auto: `https://vidbinge.dev/embed/tv/${id}/${currentSeason}/${currentEpisode}`,
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

  const handlePrevEpisode = () =>
    currentEpisode > 1 && handleEpisodeChange(currentEpisode - 1);
  const handleNextEpisode = () =>
    currentEpisode < tvShow.season.episodes.length &&
    handleEpisodeChange(currentEpisode + 1);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Backdrop Gradient */}
      <div className="absolute inset-0 -z-10 max-h-[600px] overflow-hidden opacity-20">
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
          <motion.div
            className="relative pt-[56.25%] bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <iframe
              src={endpoints[selectedEndpoint]}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title={tvShow.name}
            />
          </motion.div>

          {/* Player Controls */}
          <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <motion.button
                  onClick={handlePrevEpisode}
                  disabled={currentEpisode === 1}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-green-600 disabled:opacity-50 transition-colors flex-1 sm:flex-none"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={handleNextEpisode}
                  disabled={currentEpisode === tvShow.season.episodes.length}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-green-600 disabled:opacity-50 transition-colors flex-1 sm:flex-none"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <div className="flex gap-2 w-full sm:w-auto flex-wrap justify-center">
                {Object.keys(endpoints).map((key) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`px-3 py-2 rounded-md transition-all text-sm sm:text-base sm:px-4 ${
                      selectedEndpoint === key
                        ? "bg-purple-600 shadow-purple-glow"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <span className="font-semibold text-lg text-white">
                S{currentSeason.toString().padStart(2, "0")} • E
                {currentEpisode.toString().padStart(2, "0")}
              </span>
              <span className="text-gray-300 text-sm">
                {tvShow.season.episodes[currentEpisode - 1]?.name}
              </span>
            </div>
          </div>

          {/* Season/Episode Selectors */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br text-white from-gray-800 to-gray-850 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-6 h-6 text-purple-400" />
                Season Selection
              </h2>
              <select
                value={currentSeason}
                onChange={(e) => handleSeasonChange(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 text-lg"
              >
                {Array.from(
                  { length: tvShow.number_of_seasons },
                  (_, i) => i + 1
                ).map((seasonNum) => (
                  <option key={seasonNum} value={seasonNum}>
                    Season {seasonNum}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-400" />
                Episodes (Season {currentSeason})
              </h2>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3">
                {tvShow.season.episodes.map((episode) => (
                  <motion.button
                    key={episode.episode_number}
                    onClick={() => handleEpisodeChange(episode.episode_number)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                      currentEpisode === episode.episode_number
                        ? "bg-purple-600 scale-105 shadow-purple-glow"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {episode.episode_number}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Show Information Sidebar */}
        <div className="space-y-6">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-2xl border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Rating</p>
                      <p className="font-semibold text-white">
                        {tvShow.vote_average?.toFixed(1)}/10
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">First Air Date</p>
                      <p className="font-semibold text-white">
                        {formatDate(tvShow.first_air_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Tv2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Seasons</p>
                      <p className="font-semibold text-white">
                        {tvShow.number_of_seasons}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Episodes</p>
                      <p className="font-semibold text-white">
                        {tvShow.number_of_episodes}
                      </p>
                    </div>
                  </div>
                </div>

                {tvShow.genres?.length > 0 && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h3 className="text-sm text-white mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {tvShow.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-xs font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Overview Section */}
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-lg border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
              <Clapperboard className="w-6 h-6 text-purple-400" />
              Overview
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {tvShow.overview || "No overview available..."}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetail;
