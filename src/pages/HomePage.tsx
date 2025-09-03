/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTMDBTrending, useTMDBPopular } from '../hooks';
import type { Media } from '../types';

// Refined Poster Component with Subtle Animations
const RefinedPoster: React.FC<{ 
  media: Media; 
  index: number; 
  isInView: boolean;
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
}> = ({ media, index, isInView, size = 'medium', showInfo = true }) => {
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
    medium: 'w-40 h-60 sm:w-48 sm:h-72',
    large: 'w-48 h-72 sm:w-56 sm:h-84'
  };

  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(rating)) return 'N/A';
    return rating.toFixed(1);
  };

  const getYear = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).getFullYear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`group relative ${sizeClasses[size]} cursor-pointer`}
      onClick={handleClick}
    >
      {/* Main Poster */}
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={media.posterUrl}
          alt={media.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Overlay */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight">
                  {media.title}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{getYear(media.releaseDate)}</span>
                  </div>
                  {media.rating && media.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-current" />
                      <span>{formatRating(media.rating)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-black rounded-md text-xs font-medium transition-colors duration-200"
                  >
                    <Play size={12} />
                    <span>Play</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white rounded-md text-xs font-medium backdrop-blur-sm transition-colors duration-200"
                  >
                    <Info size={12} />
                    <span>Info</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simple Type Badge */}
        <div className="absolute top-3 left-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${
              media.type === 'movie' 
                ? 'bg-blue-500/80 text-white' 
                : 'bg-purple-500/80 text-white'
            }`}
          >
            {media.type === 'movie' ? 'Movie' : 'TV'}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Elegant Scrollable Row Component
const ElegantMediaRow: React.FC<{
  title: string;
  media: Media[];
  loading: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ title, media, loading, size = 'medium' }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.current) return;
    
    const scrollAmount = size === 'small' ? 400 : size === 'large' ? 600 : 500;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    scrollContainer.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollContainer.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setScrollPosition(scrollLeft);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="relative group">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {title}
        </h2>
      </motion.div>

      {/* Navigation Buttons */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
        
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainer}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          // Elegant Loading Skeletons
          Array.from({ length: 10 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 ${
                size === 'small' ? 'w-32 h-48' : 
                size === 'large' ? 'w-48 h-72' : 'w-40 h-60'
              } bg-gradient-to-b from-gray-800/30 to-gray-900/50 rounded-lg animate-pulse`}
            />
          ))
        ) : (
          // Refined Posters
          media.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
              <RefinedPoster
                media={item}
                index={index}
                isInView={true}
                size={size}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Auto-Scrolling Trending Component (for Trending This Week only)
const AutoScrollingTrendingRow: React.FC<{
  title: string;
  media: Media[];
  loading: boolean;
  size?: 'small' | 'medium' | 'large';
}> = ({ title, media, loading, size = 'large' }) => {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainer.current;
    if (!container || loading || !media.length) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 3; // Pixels per frame (increased from 0.5)
    const itemWidth = size === 'small' ? 160 : size === 'large' ? 240 : 200;
    const totalWidth = media.length * itemWidth;

    const autoScroll = () => {
      if (!container) return;
      
      scrollPosition += scrollSpeed;
      
      // Reset to beginning when we've scrolled through all items
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scrolling after a delay
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
    medium: 'w-40 h-60 sm:w-48 sm:h-72',
    large: 'w-48 h-72 sm:w-56 sm:h-84'
  };

  return (
    <div className="relative">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {title}
        </h2>
      </motion.div>

      {/* Auto-Scrolling Container */}
      <div 
        ref={scrollContainer}
        className="flex gap-4 overflow-x-hidden px-4 sm:px-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          // Loading Skeletons
          Array.from({ length: 10 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 ${sizeClasses[size]} bg-gradient-to-b from-gray-800/30 to-gray-900/50 rounded-lg animate-pulse`}
            />
          ))
        ) : (
          // Duplicate the media array to create seamless loop
          [...media, ...media].map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
              <RefinedPoster
                media={item}
                index={index % media.length}
                isInView={true}
                size={size}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { data: popularMovies, loading: moviesLoading } = useTMDBPopular('movie');
  const { data: popularTVShows, loading: tvLoading } = useTMDBPopular('tv');
  const { data: trendingWeek, loading: trendingWeekLoading } = useTMDBTrending('all', 'week');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      {/* Refined Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Entertainment
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Explore thousands of movies and TV shows with detailed information, ratings, and reviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Play size={20} />
                Get Started
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-3 text-lg font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                <Info size={20} />
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections with Clean Spacing */}
      <div className="space-y-16 py-16">
        {/* Trending This Week - Auto Scrolling */}
        <AutoScrollingTrendingRow
          title="⭐ Trending This Week"
          media={trendingWeek || []}
          loading={trendingWeekLoading}
          size="large"
        />

        {/* Popular Movies */}
        <ElegantMediaRow
          title="🎬 Popular Movies"
          media={popularMovies?.results || []}
          loading={moviesLoading}
          size="medium"
        />

        {/* Popular TV Shows */}
        <ElegantMediaRow
          title="📺 Popular TV Shows"
          media={popularTVShows?.results || []}
          loading={tvLoading}
          size="medium"
        />
      </div>
    </div>
  );
};
