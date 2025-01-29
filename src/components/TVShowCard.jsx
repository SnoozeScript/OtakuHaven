import PropTypes from "prop-types";
import { Calendar, Star } from "lucide-react";

const TVShowCard = ({ tvShow, onSelect }) => {
  return (
    <div
      className="group block bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-500 transition-all cursor-pointer transform hover:-translate-y-1"
      onClick={onSelect}
    >
      <div className="relative aspect-[2/3] bg-gradient-to-br from-indigo-900/50 to-cyan-900/50">
        <img
          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          alt={tvShow.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/450";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 line-clamp-2">
          {tvShow.name}
        </h2>
        <div className="flex items-center text-gray-400 text-sm space-x-2">
          <Calendar className="w-4 h-4 text-cyan-300" />
          <span>{tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : "N/A"}</span>
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">
            {tvShow.vote_average ? tvShow.vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
        {tvShow.genres && tvShow.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tvShow.genres.slice(0, 2).map((genre) => (
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
TVShowCard.propTypes = {
  tvShow: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    first_air_date: PropTypes.string,
    vote_average: PropTypes.number,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TVShowCard;
