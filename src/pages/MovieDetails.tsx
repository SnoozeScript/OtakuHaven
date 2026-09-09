/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Star, Calendar, Clock, ArrowLeft, Globe } from 'lucide-react';
import { useTMDBMediaDetails } from '../hooks/useTMDB';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { AuthModal } from '../components/auth/AuthModal';
import { logger } from '../utils';
import { getPlayerUrl, PLAYER_PROVIDERS, VIDFAST_CONFIG, VIDLINK_ORIGIN, type PlayerProviderId } from '../constants';

interface MovieDetailsProps {
  movieId: string;
  onBack?: () => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onBack }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProviderId>('vidfast');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { currentUser } = useAuth();
  const {
    checkIsInWatchlist,
    checkIsInFavorites,
    addItemToWatchlist,
    removeItemFromWatchlistById,
    addItemToFavorites,
    removeItemFromFavoritesById
  } = useUserData();

  const { data: movie, loading, error } = useTMDBMediaDetails(parseInt(movieId), 'movie');

  // Check if movie is in user's lists
  const isInWatchlist = currentUser ? checkIsInWatchlist(parseInt(movieId)) : false;
  const isLiked = currentUser ? checkIsInFavorites(parseInt(movieId)) : false;

  // Player progress tracking (VidFast + VidLink postMessage events)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === VIDLINK_ORIGIN) {
        if (event.data?.type === 'MEDIA_DATA') {
          const mediaData = event.data.data;
          localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
          logger.debug('VidLink Progress Saved:', mediaData);
        }
        return;
      }

      if (!(VIDFAST_CONFIG.origins as readonly string[]).includes(event.origin)) return;

      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem(VIDFAST_CONFIG.localStorageKey, JSON.stringify(mediaData));
        logger.debug('VidFast Progress Saved:', mediaData);
      }

      if (event.data?.type === 'PLAYER_EVENT') {
        const { event: eventType, currentTime, duration } = event.data.data;
        logger.debug(`Player ${eventType} at ${currentTime}s of ${duration}s`);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleWatchlistToggle = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!movie) return;

    try {
      if (isInWatchlist) {
        await removeItemFromWatchlistById(parseInt(movieId));
      } else {
        await addItemToWatchlist({
          id: parseInt(movieId),
          title: movie.title,
          type: 'movie' as const,
          year: new Date(movie.releaseDate).getFullYear(),
          rating: movie.rating,
          poster: movie.posterUrl
        });
      }
    } catch (error) {
      logger.error('Error toggling watchlist:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!movie) return;

    try {
      if (isLiked) {
        await removeItemFromFavoritesById(parseInt(movieId));
      } else {
        await addItemToFavorites({
          id: parseInt(movieId),
          title: movie.title,
          type: 'movie' as const,
          year: new Date(movie.releaseDate).getFullYear(),
          rating: movie.rating,
          poster: movie.posterUrl
        });
      }
    } catch (error) {
      logger.error('Error toggling favorites:', error);
    }
  };

  const handleWatchNow = () => {
    const playerSection = document.getElementById('content-section');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-full border-[3px] border-white/10 border-t-cyan-300 animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="glass rounded-3xl px-8 py-12 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">🎬</div>
          <div className="text-white text-xl font-semibold mb-2">Movie not found</div>
          <div className="text-white/45 text-sm">{error || 'The requested movie could not be loaded'}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px]">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/25 to-transparent" />
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 pt-16 sm:pt-20 md:pt-24"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="group flex items-center gap-2 glass-strong px-3.5 py-2 rounded-xl hover:border-cyan-300/30 transition-all"
              >
                <ArrowLeft size={15} className="text-cyan-300 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-white font-medium text-sm">Back</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Movie Information */}
        <div className="absolute inset-0 flex items-center justify-start p-4 sm:p-8 pt-28 sm:pt-32 md:pt-40 z-10">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Meta line */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-sky-400/20 text-sky-300 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md">
                  Movie
                </span>
                {movie.genres?.[0] && (
                  <span className="eyebrow !text-white/50">{movie.genres[0]}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-5 sm:mb-6 leading-[1.02] tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
                  {movie.title}
                </span>
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5 sm:mb-7">
                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm font-semibold">
                  <Star size={13} className="text-amber-300 fill-amber-300" />
                  {movie.rating?.toFixed(1) || 'N/A'}
                  <span className="text-white/40 text-xs font-medium">/ 10</span>
                </span>

                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85">
                  <Calendar size={13} className="text-cyan-300" />
                  {new Date(movie.releaseDate).getFullYear()}
                </span>

                {movie.duration && (
                  <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85">
                    <Clock size={13} className="text-cyan-300" />
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                )}

                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85 capitalize">
                  <Globe size={13} className="text-cyan-300" />
                  {movie.language}
                </span>
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap">
                {movie.genres?.slice(0, 3).map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 glass rounded-lg text-xs font-medium text-white/75"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <motion.p
                className="text-sm sm:text-base lg:text-lg text-white/75 mb-7 sm:mb-9 max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {movie.description}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <button
                  onClick={handleWatchNow}
                  className="group flex items-center justify-center gap-2.5 bg-brand text-white px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-glow hover:shadow-glow-violet hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  <Play size={17} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                  Watch Now
                </button>

                <button
                  onClick={handleWatchlistToggle}
                  className={`group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base glass transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                    isInWatchlist ? 'text-emerald-300 !border-emerald-400/30' : 'text-white hover:!border-cyan-300/25'
                  }`}
                >
                  <Plus size={17} className={`transition-transform duration-300 ${isInWatchlist ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                  {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                </button>

                <button
                  onClick={handleLikeToggle}
                  className={`group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base glass transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                    isLiked ? 'text-pink-300 !border-pink-400/30' : 'text-white hover:!border-pink-300/25'
                  }`}
                >
                  <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} className="group-hover:scale-110 transition-transform" />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* Player Section */}
      <div id="content-section" className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                  <Play size={15} className="text-cyan-300" fill="currentColor" />
                </div>
                <div>
                  <p className="eyebrow mb-0.5">Now playing</p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{movie.title}</h2>
                </div>
              </div>

              {/* Provider switcher */}
              <div className="flex items-center gap-1 glass rounded-xl p-1 self-start sm:self-auto">
                {PLAYER_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedPlayer(provider.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      selectedPlayer === provider.id
                        ? 'bg-brand text-white shadow-glow-sm'
                        : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Player */}
            <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-card">
              <iframe
                key={selectedPlayer}
                src={getPlayerUrl(selectedPlayer, 'movie', movie.id)}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media; autoplay"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-sm font-medium">
                  Streaming on {PLAYER_PROVIDERS.find(p => p.id === selectedPlayer)?.label}
                </span>
              </div>
              <span className="text-white/40 text-xs">Switch providers if one doesn't work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
