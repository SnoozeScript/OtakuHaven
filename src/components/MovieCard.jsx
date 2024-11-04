import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Calendar, Star, Clock, Loader2 } from "lucide-react";

const MovieCard = ({ movie }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-[2/3] bg-gray-900">
        {imageLoading && <Loader2 className="absolute inset-0 m-auto w-8 h-8 animate-spin text-blue-500" />}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageError(true);
            setImageLoading(false);
            e.target.src = "/api/placeholder/300/450";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 line-clamp-2">{movie.title}</h2>
        <div className="flex items-center text-gray-400 text-sm space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(movie.release_date).getFullYear()}</span>
          {movie.runtime && (
            <>
              <Clock className="w-4 h-4" />
              <span>{formatRuntime(movie.runtime)}</span>
            </>
          )}
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
        </div>
        {movie.genres && (
          <div className="mt-3 flex gap-2">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
