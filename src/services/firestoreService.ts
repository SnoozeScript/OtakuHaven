/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  type Unsubscribe 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';

export interface MediaItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  year: number;
  rating: number;
  poster: string;
  addedDate: string;
}

export interface UserData {
  watchlist: MediaItem[];
  favorites: MediaItem[];
  createdAt: string;
  updatedAt: string;
}

// Create or get user document
export const createUserDocument = async (user: User): Promise<void> => {
  if (!user) return;
  
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    const userData: UserData = {
      watchlist: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userDocRef, userData);
  }
};

// Get user's watchlist and favorites
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Add item to watchlist
export const addToWatchlist = async (userId: string, mediaItem: MediaItem): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Add current timestamp to the media item
    const itemWithDate = {
      ...mediaItem,
      addedDate: new Date().toISOString()
    };
    
    await updateDoc(userDocRef, {
      watchlist: arrayUnion(itemWithDate),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

// Remove item from watchlist
export const removeFromWatchlist = async (userId: string, mediaItem: MediaItem): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      watchlist: arrayRemove(mediaItem),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

// Add item to favorites
export const addToFavorites = async (userId: string, mediaItem: MediaItem): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Add current timestamp to the media item
    const itemWithDate = {
      ...mediaItem,
      addedDate: new Date().toISOString()
    };
    
    await updateDoc(userDocRef, {
      favorites: arrayUnion(itemWithDate),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove item from favorites
export const removeFromFavorites = async (userId: string, mediaItem: MediaItem): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      favorites: arrayRemove(mediaItem),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Check if item is in watchlist
export const isInWatchlist = (watchlist: MediaItem[], itemId: number): boolean => {
  return watchlist.some(item => item.id === itemId);
};

// Check if item is in favorites
export const isInFavorites = (favorites: MediaItem[], itemId: number): boolean => {
  return favorites.some(item => item.id === itemId);
};

// Subscribe to user data changes
export const subscribeToUserData = (
  userId: string, 
  callback: (userData: UserData | null) => void
): Unsubscribe => {
  const userDocRef = doc(db, 'users', userId);
  
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserData);
    } else {
      callback(null);
    }
  });
};

// Helper function to find and remove item from array (for complex removal)
export const removeItemFromWatchlist = async (userId: string, itemId: number): Promise<void> => {
  try {
    console.log('removeItemFromWatchlist called with userId:', userId, 'itemId:', itemId);
    const userData = await getUserData(userId);
    if (!userData) {
      console.log('No user data found');
      return;
    }
    
    console.log('Current watchlist:', userData.watchlist);
    const updatedWatchlist = userData.watchlist.filter(item => item.id !== itemId);
    console.log('Updated watchlist:', updatedWatchlist);
    
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      watchlist: updatedWatchlist,
      updatedAt: new Date().toISOString()
    });
    console.log('Watchlist updated successfully');
  } catch (error) {
    console.error('Error removing item from watchlist:', error);
    throw error;
  }
};

// Helper function to find and remove item from favorites
export const removeItemFromFavorites = async (userId: string, itemId: number): Promise<void> => {
  try {
    console.log('removeItemFromFavorites called with userId:', userId, 'itemId:', itemId);
    const userData = await getUserData(userId);
    if (!userData) {
      console.log('No user data found');
      return;
    }
    
    console.log('Current favorites:', userData.favorites);
    const updatedFavorites = userData.favorites.filter(item => item.id !== itemId);
    console.log('Updated favorites:', updatedFavorites);
    
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      favorites: updatedFavorites,
      updatedAt: new Date().toISOString()
    });
    console.log('Favorites updated successfully');
  } catch (error) {
    console.error('Error removing item from favorites:', error);
    throw error;
  }
};
