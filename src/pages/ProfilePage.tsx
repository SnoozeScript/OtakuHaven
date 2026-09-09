/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Heart,
  Bookmark,
  Star,
  Trash2,
  LogOut
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import { EmptyState, SectionHeading } from '../components/common';
import { logger } from '../utils';
import type { MediaItem } from '../services/firestoreService';

const MediaCard: React.FC<{
  item: MediaItem;
  onRemove: (id: number) => void;
}> = ({ item, onRemove }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the delete button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (item.type === 'movie') {
      navigate({ to: '/movie/$movieId', params: { movieId: item.id.toString() } });
    } else {
      navigate({ to: '/tv-show/$showId', params: { showId: item.id.toString() } });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-ink-800 ring-1 ring-white/10 group-hover:ring-cyan-300/35 transition-all duration-300">
        {/* Poster */}
        <img
          src={item.poster}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          onError={(e) => { e.currentTarget.style.opacity = '0'; }}
        />

        {/* Readable base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/15 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${
            item.type === 'movie' ? 'bg-sky-400/25 text-sky-200' : 'bg-violet-400/25 text-violet-200'
          }`}>
            {item.type === 'movie' ? 'Movie' : 'TV'}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logger.debug('Delete button clicked for item:', item.id);
            onRemove(item.id);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          aria-label={`Remove ${item.title}`}
          className="absolute top-2 right-2 w-7 h-7 bg-ink-950/70 hover:bg-red-500/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Trash2 size={13} />
        </button>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-[13px] line-clamp-2 leading-snug">{item.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-white/50">
            <span>{item.year}</span>
            <span className="flex items-center gap-1">
              <Star size={9} className="text-amber-300 fill-amber-300" />
              {item.rating}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, loading } = useAuth();
  const {
    watchlist,
    favorites,
    loading: userDataLoading,
    removeItemFromWatchlistById,
    removeItemFromFavoritesById
  } = useUserData();
  const navigate = useNavigate();

  // Redirect to home if user is not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate({ to: '/' });
    }
  }, [currentUser, loading, navigate]);

  // Show loading state while checking authentication or loading user data
  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-[3px] border-white/10 border-t-cyan-300 animate-spin" />
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/' });
    } catch (error) {
      logger.error('Error logging out:', error);
    }
  };

  const handleRemoveFromWatchlist = async (id: number) => {
    try {
      logger.debug('Attempting to remove item from watchlist:', id);
      await removeItemFromWatchlistById(id);
      logger.debug('Successfully removed item from watchlist:', id);
    } catch (error) {
      logger.error('Error removing from watchlist:', error);
    }
  };

  const handleRemoveFromFavorites = async (id: number) => {
    try {
      logger.debug('Attempting to remove item from favorites:', id);
      await removeItemFromFavoritesById(id);
      logger.debug('Successfully removed item from favorites:', id);
    } catch (error) {
      logger.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-10 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand shadow-glow-sm flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                {currentUser.displayName ?
                  currentUser.displayName.charAt(0).toUpperCase() :
                  <User size={28} />
                }
              </div>

              {/* User Info */}
              <div>
                <p className="eyebrow mb-1">Welcome back</p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-0.5">
                  {currentUser.displayName || 'User'}
                </h1>
                <p className="text-white/40 text-sm">{currentUser.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/45 text-sm font-semibold transition-all duration-200"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-white/[0.06]">
            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass text-sm">
              <Bookmark size={14} className="text-cyan-300" />
              <span className="font-semibold text-white">{watchlist.length}</span>
              <span className="text-white/45">in watchlist</span>
            </span>
            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass text-sm">
              <Heart size={14} className="text-pink-300" />
              <span className="font-semibold text-white">{favorites.length}</span>
              <span className="text-white/45">favorites</span>
            </span>
          </div>
        </motion.div>

        {/* Watchlist Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mb-12"
        >
          <div className="mb-5">
            <SectionHeading title="My Watchlist" icon={Bookmark} />
          </div>

          {watchlist.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3.5 pb-2" style={{ width: 'max-content' }}>
                {watchlist.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-36 sm:w-44">
                    <MediaCard
                      item={item}
                      onRemove={handleRemoveFromWatchlist}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="Nothing saved yet"
              description="Add movies and shows to your watchlist and they'll be waiting for you here."
            />
          )}
        </motion.section>

        {/* Favorites Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-5">
            <SectionHeading title="My Favorites" icon={Heart} />
          </div>

          {favorites.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3.5 pb-2" style={{ width: 'max-content' }}>
                {favorites.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-36 sm:w-44">
                    <MediaCard
                      item={item}
                      onRemove={handleRemoveFromFavorites}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Tap the heart on any title you love and it will show up here."
            />
          )}
        </motion.section>
      </div>
    </div>
  );
};
