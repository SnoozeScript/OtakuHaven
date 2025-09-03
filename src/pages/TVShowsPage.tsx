/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { 
  PlayCircle,
  Crown,
  Zap,
  Globe,
  Tv,
  Film,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Plus
} from 'lucide-react';
import { useTMDBTVByGenre, useTMDBPopular } from '../hooks/useTMDB';
import { MediaCard } from '../components/media/MediaCard';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { AuthModal } from '../components/auth/AuthModal';
import type { Media } from '../types/media';

// Local interface for this component's state management
interface LocalMedia {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: number;
  type: string;
  overview: string;
  genres?: string[];
  releaseDate?: string;
  description?: string;
}

const GENRES = [
  { id: 'action-adventure', name: 'Action & Adventure', icon: Zap, color: 'from-red-500 to-orange-500', iconColor: '#ef4444', tmdbId: 10759 },
  { id: 'animation', name: 'Animation', icon: Star, color: 'from-cyan-500 to-blue-500', iconColor: '#06b6d4', tmdbId: 16 },
  { id: 'comedy', name: 'Comedy', icon: PlayCircle, color: 'from-yellow-500 to-amber-500', iconColor: '#eab308', tmdbId: 35 },
  { id: 'crime', name: 'Crime', icon: Crown, color: 'from-red-600 to-red-700', iconColor: '#dc2626', tmdbId: 80 },
  { id: 'documentary', name: 'Documentary', icon: Tv, color: 'from-amber-600 to-orange-600', iconColor: '#d97706', tmdbId: 99 },
  { id: 'drama', name: 'Drama', icon: Film, color: 'from-blue-500 to-indigo-500', iconColor: '#3b82f6', tmdbId: 18 },
  { id: 'family', name: 'Family', icon: PlayCircle, color: 'from-green-400 to-green-500', iconColor: '#4ade80', tmdbId: 10751 },
  { id: 'kids', name: 'Kids', icon: Star, color: 'from-pink-400 to-rose-400', iconColor: '#f472b6', tmdbId: 10762 },
  { id: 'mystery', name: 'Mystery', icon: Globe, color: 'from-slate-600 to-gray-600', iconColor: '#475569', tmdbId: 9648 },
  { id: 'news', name: 'News', icon: Tv, color: 'from-blue-600 to-blue-700', iconColor: '#2563eb', tmdbId: 10763 },
  { id: 'reality', name: 'Reality', icon: Crown, color: 'from-purple-500 to-violet-500', iconColor: '#a855f7', tmdbId: 10764 },
  { id: 'sci-fi-fantasy', name: 'Sci-Fi & Fantasy', icon: Zap, color: 'from-purple-400 to-purple-600', iconColor: '#c084fc', tmdbId: 10765 },
  { id: 'soap', name: 'Soap', icon: PlayCircle, color: 'from-pink-500 to-rose-500', iconColor: '#ec4899', tmdbId: 10766 },
  { id: 'talk', name: 'Talk', icon: Globe, color: 'from-gray-500 to-slate-500', iconColor: '#6b7280', tmdbId: 10767 },
  { id: 'war-politics', name: 'War & Politics', icon: Crown, color: 'from-gray-600 to-gray-700', iconColor: '#4b5563', tmdbId: 10768 },
  { id: 'western', name: 'Western', icon: Film, color: 'from-amber-700 to-yellow-700', iconColor: '#b45309', tmdbId: 37 }
];

// Helper function to convert LocalMedia to Media format for MediaCard
const convertToMediaCard = (localMedia: LocalMedia): Media => ({
  id: localMedia.id.toString(),
  title: localMedia.title,
  description: localMedia.description || localMedia.overview,
  posterUrl: localMedia.image && localMedia.image !== '' ? localMedia.image : `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${encodeURIComponent(localMedia.title || 'No Image')}`,
  backdropUrl: localMedia.image && localMedia.image !== '' ? localMedia.image : `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${encodeURIComponent(localMedia.title || 'No Image')}`,
  releaseDate: localMedia.releaseDate || '',
  rating: localMedia.rating,
  genres: localMedia.genres || [],
  language: 'en',
  country: 'US',
  cast: [],
  crew: [],
  isWatchlisted: false,
  type: 'tv' as const,
  numberOfSeasons: 1,
  numberOfEpisodes: 10,
  seasons: [],
  status: 'Returning Series' as const,
  network: '',
  firstAirDate: localMedia.releaseDate || '',
  lastAirDate: ''
});

// Genre Section Component
interface GenreSectionProps {
  genre: typeof GENRES[0];
}

const GenreSection: React.FC<GenreSectionProps> = ({ genre }) => {
  const { data: tvShows, loading } = useTMDBTVByGenre(genre.tmdbId);
  
  // Convert TV shows to LocalMedia format for this genre
  const genreShows: LocalMedia[] = tvShows?.results?.map((show: Media): LocalMedia => {
    return {
      id: parseInt(show.id),
      title: show.title,
      image: show.posterUrl || `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${encodeURIComponent(show.title || 'No Image')}`,
      rating: show.rating || 0,
      year: new Date(show.releaseDate || '2024-01-01').getFullYear(),
      type: 'tv',
      overview: show.description || '',
      releaseDate: show.releaseDate || '2024-01-01',
      genres: show.genres || []
    };
  }) || [];
  
  if (genreShows.length === 0 && !loading) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <genre.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: genre.iconColor }} />
        <h2 className="text-xl sm:text-2xl font-bold text-white">{genre.name}</h2>
      </div>
      
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-3 sm:gap-4 lg:gap-6 pb-3 sm:pb-4 min-w-max">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-56 lg:h-80 bg-gray-800 rounded-lg animate-pulse" />
            ))
          ) : (
            genreShows.slice(0, 20).map((show) => (
              <div key={show.id} className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56">
                <MediaCard media={convertToMediaCard(show)} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Hero Carousel Component for Trending TV Shows
const HeroCarousel: React.FC = () => {
  const { data: popularShows, loading } = useTMDBPopular('tv');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    checkIsInWatchlist, 
    addItemToWatchlist, 
    removeItemFromWatchlistById 
  } = useUserData();
  
  const trendingShows = popularShows?.results?.slice(0, 20) || [];

  useEffect(() => {
    if (trendingShows.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trendingShows.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingShows.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingShows.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingShows.length) % trendingShows.length);
  };

  const handleWatchNow = () => {
    const currentShow = trendingShows[currentSlide];
    if (currentShow) {
      navigate({ to: `/tv-show/${currentShow.id}` });
    }
  };

  const handleMyListToggle = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const currentShow = trendingShows[currentSlide];
    if (!currentShow) return;

    try {
      const showId = parseInt(currentShow.id);
      const isInWatchlist = checkIsInWatchlist(showId);
      
      if (isInWatchlist) {
        await removeItemFromWatchlistById(showId);
      } else {
        await addItemToWatchlist({
          id: showId,
          title: currentShow.title,
          type: 'tv' as const,
          year: new Date(currentShow.releaseDate).getFullYear(),
          rating: currentShow.rating,
          poster: currentShow.posterUrl
        });
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  if (loading || trendingShows.length === 0) {
    return (
      <div className="relative h-[70vh] bg-gray-800 rounded-2xl animate-pulse mb-12" />
    );
  }

  const currentShow = trendingShows[currentSlide];

  return (
    <div className="relative h-[50vh] sm:h-[60vh] lg:h-[80vh] rounded-2xl lg:rounded-3xl overflow-hidden mb-8 lg:mb-12 group shadow-2xl">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url(${currentShow?.backdropUrl || currentShow?.posterUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-teal-900/10" />
      </div>

      {/* Content with Enhanced Layout */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-20">
        <div className="max-w-full sm:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-6 lg:space-y-8">
          {/* Category Badge */}
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-400 to-teal-500 text-black px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            Trending Now
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-2xl sm:text-4xl lg:text-5xl xl:text-7xl font-black text-white leading-tight tracking-tight"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)'
            }}
          >
            {currentShow?.title}
          </motion.h1>
          
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-xl text-white/95 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-full sm:max-w-xl lg:max-w-2xl font-medium"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.7)'
            }}
          >
            {currentShow?.description}
          </motion.p>

          <motion.div
            key={`rating-${currentSlide}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-wrap"
          >
            <div className="flex items-center gap-1 sm:gap-2 bg-black/30 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current" />
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                {currentShow?.rating?.toFixed(1) || 'N/A'}
              </span>
              <span className="text-white/60 text-xs sm:text-sm">/10</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-white/80">
              <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {new Date(currentShow?.releaseDate || '').getFullYear()}
              </span>
              <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold uppercase">
                TV Show
              </span>
            </div>
          </motion.div>

          <motion.div
            key={`buttons-${currentSlide}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <button 
              onClick={handleWatchNow}
              className="group flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-300 hover:to-teal-400 text-black px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current group-hover:scale-110 transition-transform" />
              Watch Now
            </button>
            <button 
              onClick={handleMyListToggle}
              className={`group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 backdrop-blur-md border transform hover:scale-105 ${
                currentUser && trendingShows[currentSlide] && checkIsInWatchlist(parseInt(trendingShows[currentSlide].id))
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/25 border-green-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
              }`}
            >
              <Plus className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-300 ${
                currentUser && trendingShows[currentSlide] && checkIsInWatchlist(parseInt(trendingShows[currentSlide].id))
                  ? 'rotate-45'
                  : 'group-hover:rotate-90'
              }`} />
              {currentUser && trendingShows[currentSlide] && checkIsInWatchlist(parseInt(trendingShows[currentSlide].id))
                ? 'Added to List'
                : 'My List'
              }
            </button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 hover:border-white/30 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 hover:border-white/30 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {trendingShows.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 ${
              index === currentSlide 
                ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full shadow-lg' 
                : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full hover:scale-150'
            }`}
          />
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default function TVShowsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 w-full pt-4 sm:pt-6 lg:pt-8 pb-20 sm:pb-24 lg:pb-32">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Tv className="text-green-400" size={24} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              TV Shows
            </h1>
          </div>
        </motion.div>

        {/* Hero Carousel for Trending TV Shows */}
        <HeroCarousel />

        {/* Genre Sections */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 mb-8 sm:mb-10 lg:mb-12">
          {GENRES.map((genre) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * GENRES.indexOf(genre) }}
            >
              <GenreSection genre={genre} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
