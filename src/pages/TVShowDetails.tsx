/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Star, Calendar, ArrowLeft, Globe, Tv, Clock } from 'lucide-react';
import { useTMDBMediaDetails } from '../hooks/useTMDB';
import { useTVSeasonDetails } from '../hooks/useTVSeasonDetails';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { AuthModal } from '../components/auth/AuthModal';
import { logger } from '../utils';
import { API_CONFIG, getVidFastTvUrl, VIDFAST_CONFIG } from '../constants';
import type { TVShow } from '../types/media';

interface TVShowDetailsProps {
  showId: string;
  onBack?: () => void;
}

export const TVShowDetails: React.FC<TVShowDetailsProps> = ({ showId, onBack }) => {
  // Initialize from URL params if available
  const urlParams = new URLSearchParams(window.location.search);
  const [selectedSeason, setSelectedSeason] = useState(parseInt(urlParams.get('season') || '1'));
  const [selectedEpisode, setSelectedEpisode] = useState(parseInt(urlParams.get('episode') || '1'));
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

  const {
    data: tvShowData,
    loading,
    error
  } = useTMDBMediaDetails(parseInt(showId), 'tv');

  // Type guard to ensure we have TV show data
  const tvShow = tvShowData?.type === 'tv' ? tvShowData as TVShow : null;

  // Fetch season details with episodes
  const { data: seasonData, loading: seasonLoading } = useTVSeasonDetails(
    parseInt(showId),
    selectedSeason
  );

  // Check if TV show is in user's lists
  const isInWatchlist = currentUser ? checkIsInWatchlist(parseInt(showId)) : false;
  const isLiked = currentUser ? checkIsInFavorites(parseInt(showId)) : false;

  // Update URL when season/episode changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('season', selectedSeason.toString());
    url.searchParams.set('episode', selectedEpisode.toString());
    window.history.replaceState({}, '', url.toString());
  }, [selectedSeason, selectedEpisode]);

  // VidFast Watch Progress Tracking
  useEffect(() => {
    const handleVidFastMessage = (event: MessageEvent) => {
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

    window.addEventListener('message', handleVidFastMessage);

    return () => {
      window.removeEventListener('message', handleVidFastMessage);
    };
  }, []);

  const handleWatchlistToggle = async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!tvShow) return;

    try {
      if (isInWatchlist) {
        await removeItemFromWatchlistById(parseInt(showId));
      } else {
        await addItemToWatchlist({
          id: parseInt(showId),
          title: tvShow.title,
          type: 'tv' as const,
          year: new Date(tvShow.releaseDate).getFullYear(),
          rating: tvShow.rating,
          poster: tvShow.posterUrl
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

    if (!tvShow) return;

    try {
      if (isLiked) {
        await removeItemFromFavoritesById(parseInt(showId));
      } else {
        await addItemToFavorites({
          id: parseInt(showId),
          title: tvShow.title,
          type: 'tv' as const,
          year: new Date(tvShow.releaseDate).getFullYear(),
          rating: tvShow.rating,
          poster: tvShow.posterUrl
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 rounded-full border-[3px] border-white/10 border-t-cyan-300 animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="glass rounded-3xl px-8 py-12 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">📺</div>
          <div className="text-white text-xl font-semibold mb-2">TV Show not found</div>
          <div className="text-white/45 text-sm">{error || 'The requested TV show could not be loaded'}</div>
        </motion.div>
      </div>
    );
  }

  const currentEpisodeName = seasonData?.episodes.find(ep => ep.episodeNumber === selectedEpisode)?.name;

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
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdropUrl})` }}
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

        {/* Show Information */}
        <div className="absolute inset-0 flex items-center justify-start p-4 sm:p-8 pt-28 sm:pt-32 md:pt-40 z-10">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Meta line */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-violet-400/20 text-violet-300 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md">
                  TV Show
                </span>
                <span className="px-2.5 py-1 rounded-lg glass text-[11px] font-semibold text-white/70">
                  {tvShow?.status || 'Unknown'}
                </span>
                {tvShow.genres?.[0] && <span className="eyebrow !text-white/50">{tvShow.genres[0]}</span>}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-5 sm:mb-6 leading-[1.02] tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
                  {tvShow.title}
                </span>
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5 sm:mb-7">
                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm font-semibold">
                  <Star size={13} className="text-amber-300 fill-amber-300" />
                  {tvShow.rating?.toFixed(1) || 'N/A'}
                  <span className="text-white/40 text-xs font-medium">/ 10</span>
                </span>

                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85">
                  <Calendar size={13} className="text-cyan-300" />
                  {new Date(tvShow.firstAirDate || tvShow.releaseDate).getFullYear()}
                </span>

                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85">
                  <Tv size={13} className="text-cyan-300" />
                  {tvShow.numberOfSeasons} Season{tvShow.numberOfSeasons !== 1 ? 's' : ''}
                </span>

                <span className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/85 capitalize">
                  <Globe size={13} className="text-cyan-300" />
                  {tvShow.language}
                </span>
              </div>

              {/* Genres */}
              <div className="flex gap-2 mb-6 sm:mb-8 flex-wrap">
                {tvShow.genres?.slice(0, 3).map((genre: string, index: number) => (
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
                {tvShow.description}
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

      {/* Player + Episodes Section */}
      <div id="content-section" className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Player Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 lg:mb-14 glass rounded-3xl overflow-hidden shadow-card"
          >
            {/* Player Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.06]">
              <p className="eyebrow mb-1">Now playing</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{tvShow.title}</h2>
              <p className="text-white/45 text-sm mt-1.5">
                Season {selectedSeason} • Episode {selectedEpisode}
                {currentEpisodeName && ` • ${currentEpisodeName}`}
              </p>
            </div>

            {/* VidFast Player */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={getVidFastTvUrl(tvShow.id, selectedSeason, selectedEpisode)}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="encrypted-media; autoplay"
              />
            </div>

            {/* Player Footer */}
            <div className="px-5 py-3.5 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/70 text-sm">Streaming on VidFast</span>
              </div>
              <span className="text-white/35 text-xs hidden sm:block">Progress is saved automatically</span>
            </div>
          </motion.div>

          {/* Episodes Section */}
          <div className="space-y-6">
            {/* Season Selector */}
            <div>
              <h3 className="eyebrow mb-3">Select season</h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {Array.from({ length: tvShow?.numberOfSeasons || 1 }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      setSelectedSeason(i + 1);
                      setSelectedEpisode(1);
                    }}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedSeason === i + 1
                        ? 'bg-brand text-white shadow-glow-sm'
                        : 'glass text-white/65 hover:text-white hover:border-cyan-300/25'
                    }`}
                  >
                    Season {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Episodes List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {seasonLoading ? (
                    <h3 className="text-lg font-bold text-white">Loading episodes…</h3>
                  ) : (
                    <h3 className="text-lg font-bold text-white">
                      Episodes
                      <span className="text-white/35 font-medium ml-2 text-sm">
                        Season {selectedSeason}
                      </span>
                    </h3>
                  )}
                </div>
                {seasonData?.episodes && (
                  <span className="text-xs text-white/35">
                    {seasonData.episodes.length} episode{seasonData.episodes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {seasonLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-72 sm:w-80 shimmer rounded-2xl h-52" />
                  ))}
                </div>
              ) : seasonData?.episodes && seasonData.episodes.length > 0 ? (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {seasonData.episodes.map((episode) => {
                      const isSelected = selectedEpisode === episode.episodeNumber;
                      return (
                        <motion.div
                          key={episode.id}
                          whileHover={{ y: -3 }}
                          onClick={() => setSelectedEpisode(episode.episodeNumber)}
                          className={`flex-shrink-0 w-72 sm:w-80 cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? 'ring-2 ring-cyan-300/70 shadow-glow-sm'
                              : 'ring-1 ring-white/10 hover:ring-white/25'
                          } bg-ink-800/60`}
                        >
                          {/* Still */}
                          <div className="relative aspect-video bg-ink-900">
                            {episode.stillPath ? (
                              <img
                                src={`${API_CONFIG.tmdb.imageBaseUrl}/w780${episode.stillPath}`}
                                alt={episode.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tv size={28} className="text-white/20" />
                              </div>
                            )}

                            {/* Play Overlay */}
                            {isSelected ? (
                              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent flex items-center justify-center">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-cyan-300 rounded-full blur-xl opacity-60" />
                                  <div className="relative bg-brand rounded-full p-3.5 shadow-glow">
                                    <Play size={22} fill="white" className="text-white ml-0.5" />
                                  </div>
                                </div>
                                <span className="absolute bottom-3 left-0 right-0 text-center">
                                  <span className="bg-cyan-300/90 text-ink-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Now Playing
                                  </span>
                                </span>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-ink-950/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="bg-white/95 rounded-full p-3 scale-90 hover:scale-100 transition-transform duration-300">
                                  <Play size={20} fill="black" className="text-black ml-0.5" />
                                </div>
                              </div>
                            )}

                            {/* Episode number chip */}
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-ink-950/70 backdrop-blur-md text-[10px] font-bold text-white/90">
                              E{episode.episodeNumber}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="p-3.5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className={`text-sm font-semibold line-clamp-1 flex-1 transition-colors duration-300 ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                                {episode.name || `Episode ${episode.episodeNumber}`}
                              </h4>
                              {isSelected && (
                                <span className="flex-shrink-0 bg-cyan-300/15 text-cyan-300 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                  Playing
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              {episode.runtime > 0 ? (
                                <span className="flex items-center gap-1.5 text-xs text-white/45">
                                  <Clock size={12} />
                                  {episode.runtime} min
                                </span>
                              ) : <span />}
                              <span
                                className={`text-[11px] font-medium p-1.5 rounded-lg ${isSelected ? 'text-cyan-300' : 'text-white/35'}`}
                              >
                                <Play size={13} fill="currentColor" />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Scroll fade */}
                  {seasonData.episodes.length > 2 && (
                    <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-ink-950 to-transparent pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="text-center py-12 glass rounded-2xl">
                  <Tv size={40} className="mx-auto mb-3 text-white/25" />
                  <p className="text-white/45 text-sm">No episodes available for this season</p>
                </div>
              )}
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
