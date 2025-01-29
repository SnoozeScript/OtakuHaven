import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Clapperboard,
  Tv2,
  Film,
  Volume2,
  VolumeX,
  SkipForward,
} from "lucide-react";
import { GraphQLClient, gql } from "graphql-request";

const AnimeDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anime, setAnime] = useState(null);

  // Episode pagination
  const EPISODES_PER_PAGE = 48;
  const [currentChunk, setCurrentChunk] = useState(0);

  // Get state from URL search parameters
  const currentEpisode = parseInt(searchParams.get("episode") || "1");
  const isDub = searchParams.get("dub") === "true";
  const autoSkip = searchParams.get("autoSkip") === "true";
  const [selectedEndpoint, setSelectedEndpoint] = useState("vidsrc");

  // Calculate episodes to show
  const totalChunks = anime ? Math.ceil(anime.episodes / EPISODES_PER_PAGE) : 0;
  const currentEpisodes = anime
    ? Array.from(
        {
          length: Math.min(
            EPISODES_PER_PAGE,
            anime.episodes - currentChunk * EPISODES_PER_PAGE
          ),
        },
        (_, i) => currentChunk * EPISODES_PER_PAGE + i + 1
      )
    : [];

  // Define video endpoints
  const endpoints = {
    vidsrc: `https://vidsrc.icu/embed/anime/${id}/${currentEpisode}/${
      isDub ? "1" : "0"
    }${autoSkip ? "/1" : ""}`,
    multi: `https://player.autoembed.cc/embed/anime/${id}/${currentEpisode}?dub=${
      isDub ? "1" : "0"
    }&autoSkip=${autoSkip ? "1" : "0"}`,
  };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      const client = new GraphQLClient("https://graphql.anilist.co");
      const query = gql`
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            episodes
            coverImage {
              extraLarge
              color
            }
            bannerImage
            genres
            status
            season
            seasonYear
            averageScore
            startDate {
              year
              month
              day
            }
          }
        }
      `;

      try {
        const response = await client.request(query, { id: parseInt(id) });
        setAnime(response.Media);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  // Update chunk when episode changes
  useEffect(() => {
    const newChunk = Math.floor((currentEpisode - 1) / EPISODES_PER_PAGE);
    setCurrentChunk(newChunk);
  }, [currentEpisode]);

  const handleEpisodeChange = (newEpisode) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("episode", newEpisode);
    setSearchParams(newSearchParams);
  };

  const toggleDub = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("dub", !isDub);
    setSearchParams(newSearchParams);
  };

  const toggleAutoSkip = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("autoSkip", !autoSkip);
    setSearchParams(newSearchParams);
  };

  if (!anime) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  const formatDate = () => {
    if (!anime.startDate.year) return "Unknown";
    const { year, month, day } = anime.startDate;
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Backdrop Gradient */}
      <div className="absolute inset-0 -z-10 max-h-[600px] overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
        {anime.bannerImage && (
          <img
            src={anime.bannerImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
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
              title={anime.title.romaji}
            />
          </motion.div>

          {/* Player Controls */}
          <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEpisodeChange(currentEpisode - 1)}
                  disabled={currentEpisode === 1}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-green-600 disabled:opacity-50 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => handleEpisodeChange(currentEpisode + 1)}
                  disabled={currentEpisode === anime.episodes}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-green-600 disabled:opacity-50 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <div className="flex gap-2">
                {Object.keys(endpoints).map((key) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`px-4 py-2 rounded-md transition-all ${
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

            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-3 rounded-lg gap-4">
              <span className="font-semibold text-lg text-white">
                Episode {currentEpisode}
              </span>
              <div className="flex gap-2 text-white">
                <motion.button
                  onClick={toggleDub}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    isDub ? "bg-yellow-600" : "bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {isDub ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  {isDub ? "DUB" : "SUB"}
                </motion.button>
                <motion.button
                  onClick={toggleAutoSkip}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    autoSkip ? "bg-yellow-600" : "bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <SkipForward size={18} />
                  Auto Skip {autoSkip ? "ON" : "OFF"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Episode Grid */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clapperboard className="w-6 h-6 text-purple-400" />
                Episodes ({anime.episodes})
              </h2>

              {/* Episode Range Selector */}
              <div className="flex items-center gap-2">
                <motion.select
                  value={currentChunk}
                  onChange={(e) => setCurrentChunk(Number(e.target.value))}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {Array.from({ length: totalChunks }, (_, i) => (
                    <option key={i} value={i}>
                      Episodes {i * EPISODES_PER_PAGE + 1} -{" "}
                      {Math.min((i + 1) * EPISODES_PER_PAGE, anime.episodes)}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>

            {/* Episode Buttons */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3">
              {currentEpisodes.map((episodeNumber) => (
                <motion.button
                  key={episodeNumber}
                  onClick={() => handleEpisodeChange(episodeNumber)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    currentEpisode === episodeNumber
                      ? "bg-purple-600 scale-105 shadow-purple-glow"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {episodeNumber}
                </motion.button>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalChunks > 1 && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <motion.button
                  onClick={() =>
                    setCurrentChunk((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentChunk === 0}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                >
                  Previous 100
                </motion.button>

                <span className="px-4 py-2 text-gray-300 text-center">
                  Showing {currentChunk * EPISODES_PER_PAGE + 1} -{" "}
                  {Math.min(
                    (currentChunk + 1) * EPISODES_PER_PAGE,
                    anime.episodes
                  )}
                </span>

                <motion.button
                  onClick={() =>
                    setCurrentChunk((prev) =>
                      Math.min(totalChunks - 1, prev + 1)
                    )
                  }
                  disabled={currentChunk === totalChunks - 1}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                >
                  Next 100
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Anime Information Sidebar */}
        <div className="space-y-6">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-2xl border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={anime.coverImage.extraLarge}
              alt={anime.title.romaji}
              className="w-full rounded-xl mb-6 shadow-lg hover:scale-105 transition-transform duration-300"
            />

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {anime.title.romaji}
              </h1>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Rating</p>
                      <p className="font-semibold text-white">
                        {anime.averageScore || "N/A"}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Release Date</p>
                      <p className="font-semibold text-white">{formatDate()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Tv2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Episodes</p>
                      <p className="font-semibold text-white">
                        {anime.episodes || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <Film className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="font-semibold text-white">{anime.status}</p>
                    </div>
                  </div>
                </div>

                {anime.genres?.length > 0 && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h3 className="text-sm text-white mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-xs font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-850 p-6 rounded-xl shadow-lg border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
              <Clapperboard className="w-6 h-6 text-purple-400" />
              Synopsis
            </h2>
            <p
              className="text-gray-300 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: anime.description }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
