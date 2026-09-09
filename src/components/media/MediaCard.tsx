/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { memo, useState } from 'react';
import { Play, Star } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { TypeChip } from '../common';
import type { Media } from '../../types';

interface MediaCardProps {
  media: Media;
  onClick?: (media: Media) => void;
  showProgress?: boolean;
}

// Memoized component to prevent unnecessary re-renders
export const MediaCard: React.FC<MediaCardProps> = memo(({
  media,
  onClick,
  showProgress = false
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Add safety check for media object
  if (!media || !media.id) {
    console.warn('MediaCard received invalid media data:', media);
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick(media);
    } else {
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
      return null;
    }
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string | undefined | null) => {
    if (!dateString) return 'TBA';
    const year = new Date(dateString).getFullYear();
    return isNaN(year) ? 'TBA' : year;
  };

  const rating = formatRating(media.rating);

  return (
    <div
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-ink-800 ring-1 ring-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:ring-cyan-300/40 hover:shadow-glow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`${media.title} - ${media.type === 'movie' ? 'Movie' : 'TV Show'}`}
    >
      {/* Poster */}
      {!imageLoaded && <div className="absolute inset-0 shimmer" />}
      <img
        src={media.posterUrl}
        alt={media.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Readable base gradient (always on) */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent" />

      {/* Play affordance on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink-950/20">
        <div className="w-14 h-14 rounded-full bg-brand shadow-glow flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play size={22} fill="white" className="text-white ml-0.5" />
        </div>
      </div>

      {/* Top chips */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
        <TypeChip type={media.type} label={media.type === 'movie' ? 'Movie' : 'TV'} />
        {rating && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-950/60 backdrop-blur-md text-[11px] font-semibold text-white">
            <Star size={10} className="text-amber-300 fill-amber-300" />
            {rating}
          </span>
        )}
      </div>

      {/* Bottom info (always visible) */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-[13px] leading-snug line-clamp-2">{media.title}</h3>
        <p className="text-white/50 text-[11px] font-medium mt-0.5">{formatYear(media.releaseDate)}</p>
      </div>

      {/* Watch progress */}
      {showProgress && media.watchProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${media.watchProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.media.id === nextProps.media.id &&
    prevProps.media.posterUrl === nextProps.media.posterUrl &&
    prevProps.showProgress === nextProps.showProgress &&
    prevProps.onClick === nextProps.onClick
  );
});
