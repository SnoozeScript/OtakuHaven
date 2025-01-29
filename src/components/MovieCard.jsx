import PropTypes from "prop-types";
import { Calendar, Star, Clock } from "lucide-react";
import { useState } from "react";

const MovieCard = ({ movie, onSelect }) => {
  const [, setImageError] = useState(false);

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div
      className="group block bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-500 transition-all cursor-pointer transform hover:-translate-y-1"
      onClick={onSelect}
    >
      <div className="relative aspect-[2/3] bg-gradient-to-br from-indigo-900/50 to-cyan-900/50">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            setImageError(true);
            e.target.src = "/api/placeholder/300/450";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 line-clamp-2">
          {movie.title}
        </h2>
        <div className="flex items-center text-gray-400 text-sm space-x-2">
          <Calendar className="w-4 h-4 text-cyan-300" />
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
        {movie.runtime && (
          <div className="flex items-center text-gray-400 text-sm mt-2">
            <Clock className="w-4 h-4 text-cyan-300" />
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
        )}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Prop Types Validation
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    runtime: PropTypes.number,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MovieCard;
