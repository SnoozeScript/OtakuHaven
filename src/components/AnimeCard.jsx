
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  return (
    <Link to={`/anime/${anime.id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:transform hover:scale-105 transition-transform duration-200">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">
            {anime.title.romaji}
          </h3>
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {anime.description}
          </p>
          <p className="text-purple-500 text-sm mt-2">
            Episodes: {anime.episodes || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;