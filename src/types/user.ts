export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  plan: SubscriptionPlan;
  preferences: UserPreferences;
  watchlist: string[];
  watchHistory: WatchHistoryItem[];
  createdAt: string;
  lastLoginAt: string;
}

export interface UserPreferences {
  language: string;
  subtitleLanguage: string;
  audioLanguage: string;
  autoplay: boolean;
  notificationsEnabled: boolean;
  favoriteGenres: string[];
  parentalControls?: ParentalControls;
}

export interface ParentalControls {
  enabled: boolean;
  maxRating: string;
  blockedContent: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  maxStreams: number;
  quality: 'SD' | 'HD' | '4K';
  isActive: boolean;
  renewalDate: string;
}

export interface WatchHistoryItem {
  mediaId: string;
  mediaType: 'movie' | 'tv';
  watchedAt: string;
  progress: number;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
}
