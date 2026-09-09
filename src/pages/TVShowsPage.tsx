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
  { id: 'action-adventure', name: 'Action & Adventure', icon: Zap, iconColor: '#f87171', tmdbId: 10759 },
  { id: 'animation', name: 'Animation', icon: Star, iconColor: '#22d3ee', tmdbId: 16 },
  { id: 'comedy', name: 'Comedy', icon: PlayCircle, iconColor: '#facc15', tmdbId: 35 },
  { id: 'crime', name: 'Crime', icon: Crown, iconColor: '#f87171', tmdbId: 80 },
  { id: 'documentary', name: 'Documentary', icon: Tv, iconColor: '#fbbf24', tmdbId: 99 },
  { id: 'drama', name: 'Drama', icon: Film, iconColor: '#93c5fd', tmdbId: 18 },
  { id: 'family', name: 'Family', icon: PlayCircle, iconColor: '#4ade80', tmdbId: 10751 },
  { id: 'kids', name: 'Kids', icon: Star, iconColor: '#f9a8d4', tmdbId: 10762 },
  { id: 'mystery', name: 'Mystery', icon: Globe, iconColor: '#94a3b8', tmdbId: 9648 },
  { id: 'news', name: 'News', icon: Tv, iconColor: '#60a5fa', tmdbId: 10763 },
  { id: 'reality', name: 'Reality', icon: Crown, iconColor: '#c084fc', tmdbId: 10764 },
  { id: 'sci-fi-fantasy', name: 'Sci-Fi & Fantasy', icon: Zap, iconColor: '#d8b4fe', tmdbId: 10765 },
  { id: 'soap', name: 'Soap', icon: PlayCircle, iconColor: '#f472b6', tmdbId: 10766 },
  { id: 'talk', name: 'Talk', icon: Globe, iconColor: '#9ca3af', tmdbId: 10767 },
  { id: 'war-politics', name: 'War & Politics', icon: Crown, iconColor: '#a1a1aa', tmdbId: 10768 },
  { id: 'western', name: 'Western', icon: Film, iconColor: '#fb923c', tmdbId: 37 }
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
            : genreShows.slice(0, 20).map((show) => (
                <div key={show.id} className="flex-shrink-0 w-32 sm:w-40 md:w-44">
                  <MediaCard media={convertToMediaCard(show)} />
                </div>
              ))}
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
    return <div className="relative h-[55vh] sm:h-[65vh] lg:h-[78vh] shimmer rounded-3xl mb-10" />;
  }

  const currentShow = trendingShows[currentSlide];
  const inWatchlist = currentUser && trendingShows[currentSlide] && checkIsInWatchlist(parseInt(trendingShows[currentSlide].id));

  return (
    <div className="relative h-[55vh] sm:h-[65vh] lg:h-[78vh] rounded-3xl overflow-hidden ring-1 ring-white/10 group shadow-card">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${currentShow?.backdropUrl || currentShow?.posterUrl})` }}
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
            {currentShow?.title}
          </motion.h1>

          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-sm sm:text-base lg:text-lg text-white/75 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          >
            {currentShow?.description}
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
              {currentShow?.rating?.toFixed(1) || 'N/A'}
              <span className="text-white/45 text-xs font-medium">/ 10</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg glass-strong text-xs font-semibold text-white/80">
              {new Date(currentShow?.releaseDate || '').getFullYear()}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-violet-400/20 text-violet-300 text-xs font-semibold uppercase tracking-wide">
              TV Show
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
        {trendingShows.map((_, index) => (
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

export default function TVShowsPage() {
  return (
    <div className="min-h-screen w-full pt-8 sm:pt-10 pb-24 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7">
          <PageHeader eyebrow="Binge-worthy series" title="TV Shows" icon={Tv} />
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
