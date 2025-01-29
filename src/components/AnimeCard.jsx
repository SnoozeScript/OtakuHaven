import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { Calendar, Clapperboard } from "lucide-react";

const AnimeCard = ({ anime }) => {
  return (
    <div className="group block bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-500 transition-all cursor-pointer transform hover:-translate-y-1">
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3] bg-gradient-to-br from-indigo-900/50 to-cyan-900/50">
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder-anime.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 line-clamp-2">
            {anime.title.romaji}
          </h2>
          
          <div className="flex items-center text-gray-400 text-sm space-x-2">
            <Calendar className="w-4 h-4 text-cyan-300" />
            <span>
              {anime.startDate?.year || "N/A"}
            </span>
            
            <Clapperboard className="w-4 h-4 text-purple-400" />
            <span className="text-white font-medium">
              {anime.episodes || "N/A"}
            </span>
          </div>

          {anime.genres && anime.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {anime.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

AnimeCard.propTypes = {
  anime: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      romaji: PropTypes.string.isRequired,
    }).isRequired,
    coverImage: PropTypes.shape({
      large: PropTypes.string.isRequired,
    }).isRequired,
    startDate: PropTypes.shape({
      year: PropTypes.number,
    }),
    episodes: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AnimeCard;