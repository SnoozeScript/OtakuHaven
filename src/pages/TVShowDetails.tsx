/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Star, Calendar, ArrowLeft, Globe, Tv } from 'lucide-react';
import { useTMDBMediaDetails } from '../hooks/useTMDB';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { AuthModal } from '../components/auth/AuthModal';
import { logger } from '../utils';
import type { TVShow } from '../types/media';

interface TVShowDetailsProps {
  showId: string;
  onBack?: () => void;
}

export const TVShowDetails: React.FC<TVShowDetailsProps> = ({ showId, onBack }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<'vidlink' | 'embed-api' | 'vidsrc'>('vidlink');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
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

  // Check if TV show is in user's lists
  const isInWatchlist = currentUser ? checkIsInWatchlist(parseInt(showId)) : false;
  const isLiked = currentUser ? checkIsInFavorites(parseInt(showId)) : false;

  // VidLink Watch Progress Tracking
  useEffect(() => {
    const handleVidLinkMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://vidlink.pro') return;
      
      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem('vidLinkTVProgress', JSON.stringify(mediaData));
        logger.debug('VidLink TV Progress Saved:', mediaData);
      }

      if (event.data?.type === 'PLAYER_EVENT') {
        const { event: eventType, currentTime, duration } = event.data.data;
        logger.debug(`Player ${eventType} at ${currentTime}s of ${duration}s`);
      }
    };

    window.addEventListener('message', handleVidLinkMessage);
    
    return () => {
      window.removeEventListener('message', handleVidLinkMessage);
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

  // Generate vidlink.pro URL for TV shows
  const getVidLinkPlayerUrl = (tmdbId: string, season: number, episode: number) => {
    const baseUrl = `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;
    
    const savedProgress = localStorage.getItem('vidLinkTVProgress');
    let startTime = 0;
    
    if (savedProgress) {
      try {
        const progressData = JSON.parse(savedProgress);
        const showProgress = progressData[`${tmdbId}-${season}-${episode}`];
        if (showProgress?.progress?.watched) {
          startTime = Math.floor(showProgress.progress.watched);
        }
      } catch (error) {
        logger.warn('Failed to parse saved progress:', error);
      }
    }
    
    const params = new URLSearchParams({
      primaryColor: '4ADE80',
      secondaryColor: '14B8A6',
      iconColor: '4ADE80',
      icons: 'vid',
      title: 'true',
      poster: 'true',
      autoplay: 'false',
      nextbutton: 'true',
      player: 'default',
      ...(startTime > 0 && { startAt: startTime.toString() })
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const getEmbedApiPlayerUrl = (tmdbId: string, season: number, episode: number) => {
    return `https://player.embed-api.stream/?id=${tmdbId}&s=${season}&e=${episode}`;
  };

  const getVidSrcPlayerUrl = (tmdbId: string, season: number, episode: number) => {
    return `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
  };

  const getPlayerUrl = (tmdbId: string, season: number, episode: number) => {
    switch (selectedPlayer) {
      case 'vidlink':
        return getVidLinkPlayerUrl(tmdbId, season, episode);
      case 'embed-api':
        return getEmbedApiPlayerUrl(tmdbId, season, episode);
      case 'vidsrc':
        return getVidSrcPlayerUrl(tmdbId, season, episode);
      default:
        return getVidLinkPlayerUrl(tmdbId, season, episode);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
                    <div className="w-20 h-20 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">📺</div>
          <div className="text-white text-2xl mb-2">TV Show not found</div>
          <div className="text-white/60">{error || 'The requested TV show could not be loaded'}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px]">
        {/* Background with Parallax Effect */}
        <motion.div 
          className="absolute inset-0 scale-110"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdropUrl})` }}
          />
          {/* Lighter Gradient Overlays for Clear Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-blue-900/5" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-green-400/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0 
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 pt-16 sm:pt-20 md:pt-24"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="group flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-lg hover:bg-black/40 transition-all border border-white/10 hover:border-green-400/30"
              >
                <ArrowLeft size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium text-sm">Back to TV Shows</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* TV Show Information */}
        <div className="absolute inset-0 flex items-center justify-start p-4 sm:p-8 pt-28 sm:pt-32 md:pt-40 z-10">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* TV Show Title */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl">
                  {tvShow.title}
                </span>
              </h1>

              {/* TV Show Meta */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-1 sm:gap-2 bg-green-400/10 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-green-400/20">
                  <Star className="text-green-400" size={14} fill="currentColor" />
                  <span className="font-bold text-white text-xs sm:text-base">{tvShow.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-white/60 text-xs sm:text-sm">/10</span>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 bg-white/5 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full">
                  <Calendar size={14} className="text-green-400" />
                  <span className="font-semibold text-white text-xs sm:text-base">{new Date(tvShow.firstAirDate || tvShow.releaseDate).getFullYear()}</span>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 bg-purple-500/10 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-purple-400/20">
                  <Tv size={14} className="text-purple-400" />
                  <span className="font-semibold text-white text-xs sm:text-base">{tvShow.numberOfSeasons} Season{tvShow.numberOfSeasons !== 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 bg-green-500/10 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-green-400/20">
                  <Globe size={14} className="text-green-400" />
                  <span className="font-semibold text-white text-xs sm:text-base">{tvShow.language}</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 bg-orange-500/10 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full border border-orange-400/20">
                  <span className="font-semibold text-orange-400 text-xs sm:text-base">{tvShow?.status || 'Unknown'}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-8 flex-wrap">
                {tvShow.genres?.slice(0, 3).map((genre: string, index: number) => (
                  <motion.span 
                    key={index}
                    className="px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-white/10 hover:border-green-400/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>

              {/* Description */}
              <motion.p 
                className="text-sm sm:text-lg text-white/90 mb-4 sm:mb-8 max-w-4xl leading-relaxed font-medium line-clamp-3 sm:line-clamp-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {tvShow.description}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button 
                  onClick={handleWatchNow}
                  className="group flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-300 hover:to-teal-400 text-black px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-green-400/25"
                >
                  <Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                  Watch Now
                </button>
                
                <button 
                  onClick={handleWatchlistToggle}
                  className={`group flex items-center justify-center gap-2 sm:gap-3 px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 ${
                    isInWatchlist 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/25'
                      : 'bg-white/5 backdrop-blur-md hover:bg-white/15 text-white border border-white/10 hover:border-green-400/30'
                  }`}
                >
                  <Plus size={18} className={`transition-transform duration-300 ${isInWatchlist ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                  <span className="hidden sm:inline">{isInWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}</span>
                  <span className="sm:hidden">{isInWatchlist ? 'Added' : 'Watchlist'}</span>
                </button>

                <button 
                  onClick={handleLikeToggle}
                  className={`group flex items-center justify-center gap-2 sm:gap-3 px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 ${
                    isLiked 
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-2xl shadow-pink-500/25'
                      : 'bg-white/5 backdrop-blur-md hover:bg-white/15 text-white border border-white/10 hover:border-pink-400/30'
                  }`}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} className="group-hover:scale-110 transition-transform" />
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section - Direct Player */}
      <div id="content-section" className="relative bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Player Section */}
          <div className="space-y-4 sm:space-y-8">
            {/* Player Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                Choose Your Player
              </h2>
              
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 w-full sm:w-auto">
                {[
                  { id: 'vidlink', label: 'VidLink' },
                  { id: 'embed-api', label: 'Embed API' },
                  { id: 'vidsrc', label: 'VidSrc' }
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPlayer(id as 'vidlink' | 'embed-api' | 'vidsrc')}
                    className={`px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                      selectedPlayer === id
                        ? 'bg-gradient-to-r from-green-400 to-teal-500 text-black shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season and Episode Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className="text-white font-medium">Season:</label>
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="bg-slate-800/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/10 hover:border-green-400/30 focus:border-green-400 focus:outline-none"
                >
                  {Array.from({ length: tvShow?.numberOfSeasons || 1 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-white font-medium">Episode:</label>
                <select 
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                  className="bg-slate-800/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/10 hover:border-green-400/30 focus:border-green-400 focus:outline-none"
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Episode {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={getPlayerUrl(tvShow.id, selectedSeason, selectedEpisode)}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Player Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm sm:text-base">
                  Currently playing Season {selectedSeason}, Episode {selectedEpisode} on: {
                    selectedPlayer === 'vidlink' ? 'VidLink Pro' :
                    selectedPlayer === 'embed-api' ? 'Embed API Stream' :
                    selectedPlayer === 'vidsrc' ? 'VidSrc ICU' : 'Unknown'
                  }
                </span>
              </div>
              <div className="text-white/60 text-sm">
                Switch players if current one doesn't work
              </div>
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
