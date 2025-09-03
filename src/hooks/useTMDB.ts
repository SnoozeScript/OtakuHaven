/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { useState, useEffect } from 'react';
import type { Media, SearchResult } from '../types';
import { tmdbService } from '../services';

export const useTMDBTrending = (mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'day') => {
  const [data, setData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        setError(null);
        const trending = await tmdbService.getTrending(mediaType, timeWindow);
        setData(trending);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending content');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [mediaType, timeWindow]);

  return { data, loading, error };
};

export const useTMDBPopular = (mediaType: 'movie' | 'tv', page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        const popular = await tmdbService.getPopular(mediaType, page);
        setData(popular);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular content');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [mediaType, page]);

  return { data, loading, error };
};

export const useTMDBSearch = (query: string, mediaType: 'movie' | 'tv' | 'multi' = 'multi', page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    const searchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await tmdbService.searchMedia(query, mediaType, page);
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchMedia, 300);
    return () => clearTimeout(timeoutId);
  }, [query, mediaType, page]);

  return { data, loading, error };
};

export const useTMDBMediaDetails = (id: number | null, mediaType: 'movie' | 'tv') => {
  const [data, setData] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await tmdbService.getMediaDetails(id, mediaType);
        setData(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch media details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  return { data, loading, error };
};

export const useTMDBRecommendations = (id: number | null, mediaType: 'movie' | 'tv') => {
  const [data, setData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData([]);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const recommendations = await tmdbService.getRecommendations(id, mediaType);
        setData(recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [id, mediaType]);

  return { data, loading, error };
};

export const useTMDBTopRated = (mediaType: 'movie' | 'tv', page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        setError(null);
        const topRated = await tmdbService.getTopRated(mediaType, page);
        setData(topRated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch top rated content');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, [mediaType, page]);

  return { data, loading, error };
};

export const useTMDBNowPlaying = (page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        setError(null);
        // For now, use popular movies as a placeholder since TMDB service doesn't have nowPlaying
        const nowPlaying = await tmdbService.getPopular('movie', page);
        setData(nowPlaying);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch now playing movies');
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, [page]);

  return { data, loading, error };
};

export const useTMDBUpcoming = (page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        setError(null);
        // For now, use popular movies as a placeholder since TMDB service doesn't have upcoming
        const upcoming = await tmdbService.getPopular('movie', page);
        setData(upcoming);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch upcoming movies');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [page]);

  return { data, loading, error };
};

export const useTMDBMoviesByGenre = (genreId: number, page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true);
        setError(null);
        const movies = await tmdbService.getMoviesByGenre(genreId, page);
        setData(movies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by genre');
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreId, page]);

  return { data, loading, error };
};

export const useTMDBTVByGenre = (genreId: number, page: number = 1) => {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVByGenre = async () => {
      try {
        setLoading(true);
        setError(null);
        const tvShows = await tmdbService.getTVByGenre(genreId, page);
        setData(tvShows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch TV shows by genre');
      } finally {
        setLoading(false);
      }
    };

    fetchTVByGenre();
  }, [genreId, page]);

  return { data, loading, error };
};
