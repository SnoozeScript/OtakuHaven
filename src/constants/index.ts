/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

// App Configuration
export const APP_CONFIG = {
  name: 'OtakuHaven',
  version: '2.0.0',
  description: 'Your ultimate streaming destination for movies and TV shows',
  supportEmail: 'support@otakuhaven.com',
} as const;

// API Configuration
export const API_CONFIG = {
  tmdb: {
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    apiKey: import.meta.env.VITE_TMDB_API_KEY,
  },
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retryAttempts: 3,
} as const;

// Media Player Configuration
export const PLAYER_CONFIG = {
  defaultVolume: 0.8,
  seekTime: 10, // seconds
  autoplayDelay: 5000, // milliseconds
  supportedQualities: ['SD', 'HD', '4K'] as const,
  supportedFormats: ['mp4', 'hls', 'dash'] as const,
} as const;

// VidFast Player Configuration (https://vidfast.vc)
export const VIDFAST_CONFIG = {
  baseUrl: 'https://vidfast.vc',
  // Origins the player may postMessage from — validate against this list
  origins: [
    'https://vidfast.pro',
    'https://vidfast.in',
    'https://vidfast.io',
    'https://vidfast.me',
    'https://vidfast.net',
    'https://vidfast.pm',
    'https://vidfast.xyz',
    'https://vidfast.vc',
    'https://vidfast.bz',
  ],
  localStorageKey: 'vidFastProgress',
} as const;

// Embed URL builders (autoPlay handled by the player itself)
export const getVidFastMovieUrl = (tmdbId: number | string, theme = '22D3EE') =>
  `${VIDFAST_CONFIG.baseUrl}/movie/${tmdbId}?autoPlay=true&theme=${theme}`;

export const getVidFastTvUrl = (
  tmdbId: number | string,
  season: number,
  episode: number,
  theme = '8B5CF6'
) => `${VIDFAST_CONFIG.baseUrl}/tv/${tmdbId}/${season}/${episode}?autoPlay=true&theme=${theme}`;

// ---------- Streaming providers ----------
// VidFast is the default player; the rest are user-switchable fallbacks.

export type PlayerProviderId = 'vidfast' | 'vidlink' | 'embed-api' | 'vidsrc';

export const PLAYER_PROVIDERS: { id: PlayerProviderId; label: string }[] = [
  { id: 'vidfast', label: 'VidFast' },
  { id: 'vidlink', label: 'VidLink' },
  { id: 'embed-api', label: 'Embed API' },
  { id: 'vidsrc', label: 'VidSrc' },
];

export const VIDLINK_ORIGIN = 'https://vidlink.pro';

export const getPlayerUrl = (
  provider: PlayerProviderId,
  mediaType: 'movie' | 'tv',
  tmdbId: number | string,
  season = 1,
  episode = 1,
): string => {
  if (provider === 'vidfast') {
    return mediaType === 'movie'
      ? getVidFastMovieUrl(tmdbId)
      : getVidFastTvUrl(tmdbId, season, episode);
  }

  if (provider === 'vidlink') {
    const params = new URLSearchParams({
      primaryColor: '22D3EE',
      secondaryColor: '818CF8',
      iconColor: '22D3EE',
      icons: 'vid',
      title: 'true',
      poster: 'true',
      autoplay: mediaType === 'tv' ? 'true' : 'false',
      nextbutton: mediaType === 'tv' ? 'true' : 'false',
      player: 'default',
    });
    // Resume from VidLink's own saved progress when available
    try {
      const saved = localStorage.getItem(
        mediaType === 'movie' ? 'vidLinkProgress' : 'vidLinkTVProgress'
      );
      if (saved) {
        const data = JSON.parse(saved);
        const entry =
          mediaType === 'movie' ? data[tmdbId] : data[`${tmdbId}-${season}-${episode}`];
        const watched = Math.floor(entry?.progress?.watched ?? 0);
        if (watched > 0) params.set('startAt', String(watched));
      }
    } catch {
      // malformed progress data — start from the beginning
    }
    const path =
      mediaType === 'movie'
        ? `movie/${tmdbId}`
        : `tv/${tmdbId}/${season}/${episode}`;
    return `https://vidlink.pro/${path}?${params.toString()}`;
  }

  if (provider === 'embed-api') {
    return mediaType === 'movie'
      ? `https://player.embed-api.stream/?id=${tmdbId}&type=movie`
      : `https://player.embed-api.stream/?id=${tmdbId}&s=${season}&e=${episode}`;
  }

  return mediaType === 'movie'
    ? `https://vidsrc.icu/embed/movie/${tmdbId}`
    : `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
};

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

// Content Ratings
export const CONTENT_RATINGS = {
  movies: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  tv: ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
} as const;

// Genres
export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western',
] as const;

// TMDB Image Sizes
export const TMDB_IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  profile: ['w45', 'w185', 'h632', 'original'],
  still: ['w92', 'w185', 'w300', 'original'],
} as const;

// TMDB API Endpoints
export const TMDB_ENDPOINTS = {
  trending: (mediaType: string, timeWindow: string) => `/trending/${mediaType}/${timeWindow}`,
  popular: (mediaType: string) => `/${mediaType}/popular`,
  topRated: (mediaType: string) => `/${mediaType}/top_rated`,
  upcoming: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  onTheAir: '/tv/on_the_air',
  airingToday: '/tv/airing_today',
  search: (mediaType: string) => `/search/${mediaType}`,
  details: (mediaType: string, id: number) => `/${mediaType}/${id}`,
  credits: (mediaType: string, id: number) => `/${mediaType}/${id}/credits`,
  videos: (mediaType: string, id: number) => `/${mediaType}/${id}/videos`,
  recommendations: (mediaType: string, id: number) => `/${mediaType}/${id}/recommendations`,
  similar: (mediaType: string, id: number) => `/${mediaType}/${id}/similar`,
  genres: (mediaType: string) => `/genre/${mediaType}/list`,
  discover: (mediaType: string) => `/discover/${mediaType}`,
} as const;

// Languages
export const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
} as const;
