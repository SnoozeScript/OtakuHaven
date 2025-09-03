/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  subscribeToUserData, 
  addToWatchlist, 
  removeItemFromWatchlist, 
  addToFavorites, 
  removeItemFromFavorites, 
  isInWatchlist, 
  isInFavorites,
  type UserData, 
  type MediaItem 
} from '../services/firestoreService';

export const useUserData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
      setUserData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addItemToWatchlist = async (mediaItem: Omit<MediaItem, 'addedDate'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const itemWithDate: MediaItem = {
      ...mediaItem,
      addedDate: new Date().toISOString()
    };
    
    await addToWatchlist(currentUser.uid, itemWithDate);
  };

  const removeItemFromWatchlistById = async (itemId: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    await removeItemFromWatchlist(currentUser.uid, itemId);
  };

  const addItemToFavorites = async (mediaItem: Omit<MediaItem, 'addedDate'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const itemWithDate: MediaItem = {
      ...mediaItem,
      addedDate: new Date().toISOString()
    };
    
    await addToFavorites(currentUser.uid, itemWithDate);
  };

  const removeItemFromFavoritesById = async (itemId: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    await removeItemFromFavorites(currentUser.uid, itemId);
  };

  const checkIsInWatchlist = (itemId: number): boolean => {
    if (!userData?.watchlist) return false;
    return isInWatchlist(userData.watchlist, itemId);
  };

  const checkIsInFavorites = (itemId: number): boolean => {
    if (!userData?.favorites) return false;
    return isInFavorites(userData.favorites, itemId);
  };

  return {
    userData,
    loading,
    watchlist: userData?.watchlist || [],
    favorites: userData?.favorites || [],
    addItemToWatchlist,
    removeItemFromWatchlistById,
    addItemToFavorites,
    removeItemFromFavoritesById,
    checkIsInWatchlist,
    checkIsInFavorites
  };
};
