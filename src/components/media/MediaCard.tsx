/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React from 'react';
import { Play, Star } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Media } from '../../types';

interface MediaCardProps {
  media: Media;
  onClick?: (media: Media) => void;
  showProgress?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  onClick, 
  showProgress = false 
}) => {
  const navigate = useNavigate();

  // Add safety check for media object
  if (!media || !media.id) {
    console.warn('MediaCard received invalid media data:', media);
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(media);
    } else {
      // Navigate to movie/tv details page
      if (media.type === 'movie') {
        navigate({ to: '/movie/$movieId', params: { movieId: media.id } });
      } else if (media.type === 'tv') {
        navigate({ to: '/tv-show/$showId', params: { showId: media.id } });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(rating)) {
      return 'N/A';
    }
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string | undefined | null) => {
    if (!dateString) {
      return 'TBA';
    }
    const year = new Date(dateString).getFullYear();
    return isNaN(year) ? 'TBA' : year;
  };

  return (
    <div 
      className="bg-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 group h-[400px] flex flex-col"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`${media.title} - ${media.type === 'movie' ? 'Movie' : 'TV Show'}`}
    >
      <div className="relative h-full overflow-hidden">
        <img 
          src={media.posterUrl} 
          alt={media.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight">
              {media.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/90">
              <span className="text-cyan-400 font-medium">
                {formatYear(media.releaseDate)}
              </span>
              <span className="flex items-center gap-1">
                <Star size={12} fill="#fbbf24" className="text-amber-400" />
                {formatRating(media.rating)}
              </span>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-cyan-500/90 hover:bg-cyan-400 text-white w-16 h-16 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
              <Play size={24} fill="white" />
            </div>
          </div>
        </div>
        {showProgress && media.watchProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${media.watchProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
