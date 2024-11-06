import { Calendar, Star } from "lucide-react";

const TVShowCard = ({ tvShow, onSelect }) => {
  return (
    <div
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative aspect-[2/3] bg-gray-900">
        <img
          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          alt={tvShow.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/450";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 line-clamp-2">{tvShow.name}</h2>
        <div className="flex items-center text-gray-400 text-sm space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">{tvShow.vote_average.toFixed(1)}</span>
        </div>
        {tvShow.genres && (
          <div className="mt-3 flex gap-2">
            {tvShow.genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowCard;