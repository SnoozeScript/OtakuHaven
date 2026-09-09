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
import { useTMDBMoviesByGenre, useTMDBPopular } from '../hooks/useTMDB';
import { MediaCard } from '../components/media/MediaCard';
import { PageHeader, SectionHeading, PosterSkeleton } from '../components/common';
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
  { id: 'action', name: 'Action', icon: Zap, iconColor: '#f87171', tmdbId: 28 },
  { id: 'romance', name: 'Romance', icon: Star, iconColor: '#f472b6', tmdbId: 10749 },
  { id: 'comedy', name: 'Comedy', icon: PlayCircle, iconColor: '#facc15', tmdbId: 35 },
  { id: 'drama', name: 'Drama', icon: Tv, iconColor: '#93c5fd', tmdbId: 18 },
  { id: 'horror', name: 'Horror', icon: Crown, iconColor: '#c084fc', tmdbId: 27 },
  { id: 'thriller', name: 'Thriller', icon: Globe, iconColor: '#9ca3af', tmdbId: 53 },
  { id: 'adventure', name: 'Adventure', icon: Film, iconColor: '#34d399', tmdbId: 12 },
  { id: 'animation', name: 'Animation', icon: Star, iconColor: '#22d3ee', tmdbId: 16 },
  { id: 'crime', name: 'Crime', icon: Zap, iconColor: '#f87171', tmdbId: 80 },
  { id: 'documentary', name: 'Documentary', icon: Tv, iconColor: '#fbbf24', tmdbId: 99 },
  { id: 'family', name: 'Family', icon: PlayCircle, iconColor: '#4ade80', tmdbId: 10751 },
  { id: 'fantasy', name: 'Fantasy', icon: Crown, iconColor: '#d8b4fe', tmdbId: 14 },
  { id: 'history', name: 'History', icon: Globe, iconColor: '#d97706', tmdbId: 36 },
  { id: 'music', name: 'Music', icon: Star, iconColor: '#f9a8d4', tmdbId: 10402 },
  { id: 'mystery', name: 'Mystery', icon: Film, iconColor: '#94a3b8', tmdbId: 9648 },
  { id: 'sci-fi', name: 'Science Fiction', icon: Zap, iconColor: '#67e8f9', tmdbId: 878 },
  { id: 'war', name: 'War', icon: Tv, iconColor: '#9ca3af', tmdbId: 10752 },
  { id: 'western', name: 'Western', icon: Crown, iconColor: '#fb923c', tmdbId: 37 }
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
  type: 'movie' as const,
  tmdbId: localMedia.id
});

// Genre Section Component
interface GenreSectionProps {
  genre: typeof GENRES[0];
}

const GenreSection: React.FC<GenreSectionProps> = ({ genre }) => {
  const { data: movies, loading } = useTMDBMoviesByGenre(genre.tmdbId);

  const genreMovies: LocalMedia[] = movies?.results?.map((movie: Media): LocalMedia => {
    return {
      id: parseInt(movie.id),
      title: movie.title,
      image: movie.posterUrl || `https://via.placeholder.com/500x750/1f2937/9ca3af?text=${encodeURIComponent(movie.title || 'No Image')}`,
      rating: movie.rating || 0,
      year: new Date(movie.releaseDate || '2024-01-01').getFullYear(),
      type: 'movie',
      overview: movie.description || '',
      releaseDate: movie.releaseDate || '2024-01-01',
      genres: movie.genres || []
    };
  }) || [];

  if (genreMovies.length === 0 && !loading) return null;

  return (
    <div className="space-y-4">
      <SectionHeading title={genre.name} icon={genre.icon} />

      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-3.5 pb-2 min-w-max">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-32 sm:w-40 md:w-44">
                  <PosterSkeleton />
                </div>
              ))
            : genreMovies.slice(0, 20).map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-32 sm:w-40 md:w-44">
                  <MediaCard media={convertToMediaCard(movie)} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

// Hero Carousel Component for Trending Movies
const HeroCarousel: React.FC = () => {
  const { data: popularMovies, loading } = useTMDBPopular('movie');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    checkIsInWatchlist,
    addItemToWatchlist,
    removeItemFromWatchlistById
  } = useUserData();

  const trendingMovies = popularMovies?.results?.slice(0, 20) || [];

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingMovies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingMovies.length) % trendingMovies.length);
  };

  const handleWatchNow = () => {
    const currentMovie = trendingMovies[currentSlide];
    if (currentMovie) {
      navigate({ to: `/movie/${currentMovie.id}` });
    }
  };

  const handleMyListToggle = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const currentMovie = trendingMovies[currentSlide];
    if (!currentMovie) return;

    try {
      const movieId = parseInt(currentMovie.id);
      const isInWatchlist = checkIsInWatchlist(movieId);

      if (isInWatchlist) {
        await removeItemFromWatchlistById(movieId);
      } else {
        await addItemToWatchlist({
          id: movieId,
          title: currentMovie.title,
          type: 'movie' as const,
          year: new Date(currentMovie.releaseDate).getFullYear(),
          rating: currentMovie.rating,
          poster: currentMovie.posterUrl
        });
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  if (loading || trendingMovies.length === 0) {
    return <div className="relative h-[55vh] sm:h-[65vh] lg:h-[78vh] shimmer rounded-3xl mb-10" />;
  }

  const currentMovie = trendingMovies[currentSlide];
  const inWatchlist = currentUser && trendingMovies[currentSlide] && checkIsInWatchlist(parseInt(trendingMovies[currentSlide].id));

  return (
    <div className="relative h-[55vh] sm:h-[65vh] lg:h-[78vh] rounded-3xl overflow-hidden ring-1 ring-white/10 group shadow-card">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${currentMovie?.backdropUrl || currentMovie?.posterUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end lg:items-center px-5 sm:px-8 lg:px-14 pb-16 lg:pb-0">
        <div className="max-w-full sm:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-5">
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            Trending Now
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.55)' }}
          >
            {currentMovie?.title}
          </motion.h1>

          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          >
            {currentMovie?.description}
          </motion.p>

          <motion.div
            key={`meta-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2.5 flex-wrap"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-strong text-sm font-semibold text-white">
              <Star size={13} className="text-amber-300 fill-amber-300" />
              {currentMovie?.rating?.toFixed(1) || 'N/A'}
              <span className="text-white/45 text-xs font-medium">/ 10</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg glass-strong text-xs font-semibold text-white/80">
              {new Date(currentMovie?.releaseDate || '').getFullYear()}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-400/20 text-sky-300 text-xs font-semibold uppercase tracking-wide">
              Movie
            </span>
          </motion.div>

          <motion.div
            key={`buttons-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <button
              onClick={handleWatchNow}
              className="group flex items-center justify-center gap-2.5 bg-brand text-white px-7 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-glow hover:shadow-glow-violet hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <Play size={17} fill="currentColor" />
              Watch Now
            </button>
            <button
              onClick={handleMyListToggle}
              className={`flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm sm:text-base glass-strong hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 ${
                inWatchlist
                  ? 'text-emerald-300 border-emerald-400/30'
                  : 'text-white hover:border-cyan-300/25'
              }`}
            >
              <Plus size={17} className={inWatchlist ? 'rotate-45' : ''} />
              {inWatchlist ? 'In Your List' : 'My List'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white/85 hover:text-white hover:border-cyan-300/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white/85 hover:text-white hover:border-cyan-300/30 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {trendingMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              index === currentSlide
                ? 'w-7 bg-brand shadow-glow-sm'
                : 'w-1.5 bg-white/35 hover:bg-white/60'
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

export default function MoviesPage() {
  return (
    <div className="min-h-screen w-full pt-8 sm:pt-10 pb-24 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <PageHeader eyebrow="Browse the big screen" title="Movies" icon={Film} />
        </div>

        {/* Hero Carousel */}
        <div className="mb-12 sm:mb-14">
          <HeroCarousel />
        </div>

        {/* Genre Sections */}
        <div className="space-y-10 sm:space-y-12">
          {GENRES.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
            >
              <GenreSection genre={genre} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
