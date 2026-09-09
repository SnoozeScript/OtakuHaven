/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, ChevronLeft, ChevronRight, Film, Tv, Sparkles, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTMDBTrending, useTMDBPopular } from '../hooks';
import { SectionHeading } from '../components/common';
import type { Media } from '../types';

// ---------- Poster (matches the shared MediaCard language) ----------

const Poster: React.FC<{
  media: Media;
  index: number;
  isInView: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ media, index, isInView, size = 'medium' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (media.type === 'movie') {
      navigate({ to: '/movie/$movieId', params: { movieId: media.id } });
    } else if (media.type === 'tv') {
      navigate({ to: '/tv-show/$showId', params: { showId: media.id } });
    }
  };

  const sizeClasses = {
    small: 'w-32 h-48 sm:w-36 sm:h-54',
    medium: 'w-40 h-60 sm:w-44 sm:h-64',
    large: 'w-44 h-64 sm:w-52 sm:h-76',
  };

  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(rating)) return null;
    return rating.toFixed(1);
  };

  const getYear = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).getFullYear();
  };

  const rating = formatRating(media.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      className={`group relative ${sizeClasses[size]} cursor-pointer transition-transform duration-300 hover:-translate-y-1.5`}
      onClick={handleClick}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-ink-800 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-cyan-300/40 group-hover:shadow-glow-sm">
        <img
          src={media.posterUrl}
          alt={media.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        />

        {/* Readable base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent" />

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink-950/20">
          <div className="w-12 h-12 rounded-full bg-brand shadow-glow-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Top chips */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${
              media.type === 'movie' ? 'bg-sky-400/20 text-sky-300' : 'bg-violet-400/20 text-violet-300'
            }`}
          >
            {media.type === 'movie' ? 'Movie' : 'TV'}
          </span>
          {rating && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ink-950/60 backdrop-blur-md text-[11px] font-semibold text-white">
              <Star size={10} className="text-amber-300 fill-amber-300" />
              {rating}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-[13px] leading-snug line-clamp-2">{media.title}</h3>
          <p className="text-white/50 text-[11px] font-medium mt-0.5">{getYear(media.releaseDate)}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- Scrollable row ----------

const MediaRow: React.FC<{
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  media: Media[];
  loading: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ title, subtitle, icon, media, loading, size = 'medium' }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.current) return;
    const scrollAmount = size === 'small' ? 400 : size === 'large' ? 600 : 500;
    const newPosition = direction === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount;
    scrollContainer.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollContainer.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setScrollPosition(scrollLeft);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const skeletonSize = {
    small: 'w-32 h-48 sm:w-36 sm:h-54',
    medium: 'w-40 h-60 sm:w-44 sm:h-64',
    large: 'w-44 h-64 sm:w-52 sm:h-76',
  }[size];

  return (
    <div className="relative">
      <div className="mb-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} icon={icon} />
      </div>

      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/80 hover:text-white hover:border-cyan-300/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={18} />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white/80 hover:text-white hover:border-cyan-300/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="flex gap-3.5 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={`flex-shrink-0 shimmer rounded-2xl ${skeletonSize}`} />
            ))
          : media.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0">
                <Poster media={item} index={index} isInView={true} size={size} />
              </div>
            ))}
      </div>
    </div>
  );
};

// ---------- Auto-scrolling trending row ----------

const AutoScrollingTrendingRow: React.FC<{
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  media: Media[];
  loading: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ title, subtitle, icon, media, loading, size = 'large' }) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainer.current;
    if (!container || loading || !media.length) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 2;
    const itemWidth = size === 'small' ? 160 : size === 'large' ? 240 : 200;
    const totalWidth = media.length * itemWidth;

    const autoScroll = () => {
      if (!container) return;
      scrollPosition += scrollSpeed;
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(autoScroll);
    };

    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(timeout);
    };
  }, [media, loading, size]);

  const sizeClasses = {
    small: 'w-32 h-48 sm:w-36 sm:h-54',
    medium: 'w-40 h-60 sm:w-44 sm:h-64',
    large: 'w-44 h-64 sm:w-52 sm:h-76',
  };
  const skeletonSize = sizeClasses[size];

  return (
    <div className="relative">
      <div className="mb-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} icon={icon} />
      </div>

      <div
        ref={scrollContainer}
        className="flex gap-3.5 overflow-x-hidden px-4 sm:px-6 lg:px-8 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={`flex-shrink-0 shimmer rounded-2xl ${skeletonSize}`} />
            ))
          : [...media, ...media].map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0">
                <Poster media={item} index={index % media.length} isInView={true} size={size} />
              </div>
            ))}
      </div>
    </div>
  );
};

// ---------- Page ----------

export const HomePage: React.FC = () => {
  const { data: popularMovies, loading: moviesLoading } = useTMDBPopular('movie');
  const { data: popularTVShows, loading: tvLoading } = useTMDBPopular('tv');
  const { data: trendingWeek, loading: trendingWeekLoading } = useTMDBTrending('all', 'week');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-medium text-white/70 mb-7">
              <Sparkles size={13} className="text-cyan-300" />
              Your universe of stories
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.08] text-white">
              Every story
              <span className="block text-brand">worth watching.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/55 mb-9 leading-relaxed max-w-xl mx-auto">
              Thousands of movies and shows — discovered, tracked, and played in one beautiful place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate({ to: '/movies' })}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand text-white font-semibold text-sm sm:text-base shadow-glow hover:shadow-glow-violet hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <Film size={18} />
                Browse Movies
              </button>
              <button
                onClick={() => navigate({ to: '/tv-shows' })}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl glass text-white font-semibold text-sm sm:text-base hover:bg-white/[0.08] hover:border-cyan-300/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <Tv size={18} />
                Browse TV Shows
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade into content */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </section>

      {/* Content rows */}
      <div className="space-y-14 sm:space-y-16 pb-24">
        <AutoScrollingTrendingRow
          title="Trending This Week"
          subtitle="What everyone is watching"
          icon={Flame}
          media={trendingWeek || []}
          loading={trendingWeekLoading}
          size="large"
        />

        <MediaRow
          title="Popular Movies"
          subtitle="Big screens, big stories"
          icon={Film}
          media={popularMovies?.results || []}
          loading={moviesLoading}
          size="medium"
        />

        <MediaRow
          title="Popular TV Shows"
          subtitle="Series you can't pause"
          icon={Tv}
          media={popularTVShows?.results || []}
          loading={tvLoading}
          size="medium"
        />
      </div>
    </div>
  );
};
