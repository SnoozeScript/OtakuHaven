import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Loader2,
  Clapperboard,
  CalendarDays,
  Clock,
  Star,
  BadgeDollarSign,
} from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("vidsrc");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/movie/${id}?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (!movie) {
    return (
      <div className="flex justify-center text-white items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  const endpoints = {
    vidsrc: `https://vidsrc.icu/embed/movie/${id}`,
    Auto: `https://vidbinge.dev/embed/movie/${id}`,
    multi: `https://player.autoembed.cc/embed/movie/${id}`,
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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
      <div className="absolute inset-0 -z-10 max-h-[600px] overflow-hidden opacity-15">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative pt-[56.25%] bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={endpoints[selectedEndpoint]}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={movie.title}
            />
          </div>

          {/* Source Selector */}
          <div className="flex gap-3 p-2 bg-gray-800 rounded-lg">
            {Object.keys(endpoints).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedEndpoint(key)}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  selectedEndpoint === key
                    ? "bg-purple-600 shadow-purple-glow"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* Movie Overview */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clapperboard className="w-6 h-6 text-purple-400" />
              Storyline
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {movie.overview || "No overview available..."}
            </p>
          </div>
        </div>

        {/* Movie Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-xl mb-6 shadow-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/api/placeholder/300/450";
              }}
            />

            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-gray-400 italic text-lg font-medium">
                  &#34;{movie.tagline}&#34;
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <span className="font-semibold">
                      {movie.vote_average?.toFixed(1)}/10
                    </span>
                    <span className="text-gray-400 ml-2 text-sm">
                      ({movie.vote_count?.toLocaleString()} votes)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Released</p>
                      <p className="font-medium">
                        {formatDate(movie.release_date)}
                      </p>
                    </div>
                  </div>

                  {movie.runtime && (
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Runtime</p>
                        <p className="font-medium">
                          {formatRuntime(movie.runtime)}
                        </p>
                      </div>
                    </div>
                  )}

                  {movie.budget > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <BadgeDollarSign className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="font-medium">
                          ${movie.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {movie.status && (
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="font-medium">{movie.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
