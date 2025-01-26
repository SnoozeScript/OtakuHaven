import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  // Using the exact endpoint format
  //const videoUrl = `https://vidsrc.icu/embed/movie/${id}`;
  const endpoints = {
    vidsrc: `https://vidsrc.icu/embed/movie/${id}`,
    multi: `https://player.autoembed.cc/embed/movie/${id}`,
  };

  const videoUrl = endpoints[selectedEndpoint];

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={videoUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={movie.title}
            ></iframe>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              {/* Endpoint Selector Buttons */}
              <button
                onClick={() => setSelectedEndpoint("vidsrc")}
                className={`px-4 py-2 rounded ${
                  selectedEndpoint === "vidsrc"
                    ? "bg-purple-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                VidSrc
              </button>
              <button
                onClick={() => setSelectedEndpoint("multi")}
                className={`px-4 py-2 rounded ${
                  selectedEndpoint === "multi"
                    ? "bg-purple-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Multi
              </button>
            </div>
          </div>
          {/* Movie Overview */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>
        </div>

        {/* Movie Information Sidebar */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg mb-4 shadow-md"
            onError={(e) => {
              e.target.src = "/api/placeholder/300/450";
            }}
          />

          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
          )}

          <div className="space-y-3 text-gray-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Rating:</span>
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                {movie.vote_average?.toFixed(1)}/10
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold">Release Date:</span>
              <span>{formatDate(movie.release_date)}</span>
            </div>

            {movie.runtime && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">Runtime:</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}

            {movie.status && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">Status:</span>
                <span>{movie.status}</span>
              </div>
            )}

            {movie.budget > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-semibold">Budget:</span>
                <span>${movie.budget.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-purple-500 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Production Companies */}
          {movie.production_companies &&
            movie.production_companies.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Production Companies
                </h3>
                <div className="space-y-2 text-gray-300">
                  {movie.production_companies.map((company) => (
                    <div key={company.id}>{company.name}</div>
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
