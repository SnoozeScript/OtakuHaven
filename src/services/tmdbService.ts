/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import type { Media, Movie, TVShow, SearchResult } from '../types';
import { API_CONFIG, TMDB_ENDPOINTS, TMDB_IMAGE_SIZES } from '../constants';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  original_language: string;
  production_countries?: { iso_3166_1: string; name: string }[];
  budget?: number;
  revenue?: number;
  imdb_id?: string;
}

interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  original_language: string;
  origin_country?: string[];
  status?: string;
  networks?: { id: number; name: string }[];
  last_air_date?: string;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

class TMDBService {
  private baseUrl = API_CONFIG.tmdb.baseUrl;
  private apiKey = API_CONFIG.tmdb.apiKey;
  private imageBaseUrl = API_CONFIG.tmdb.imageBaseUrl;

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('api_key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TMDB API request failed:', error);
      throw error;
    }
  }

  private getImageUrl(path: string | null, _type: keyof typeof TMDB_IMAGE_SIZES, size: string = 'w500'): string {
    if (!path) {
      return '/placeholder-image.svg';
    }
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  private transformTMDBMovie(tmdbMovie: TMDBMovie, genres: TMDBGenre[] = []): Movie {
    return {
      id: tmdbMovie.id.toString(),
      type: 'movie',
      title: tmdbMovie.title || 'Unknown Title',
      description: tmdbMovie.overview || 'No description available.',
      posterUrl: this.getImageUrl(tmdbMovie.poster_path, 'poster', 'w500'),
      backdropUrl: this.getImageUrl(tmdbMovie.backdrop_path, 'backdrop', 'w1280'),
      releaseDate: tmdbMovie.release_date || '',
      rating: tmdbMovie.vote_average || 0,
      genres: tmdbMovie.genre_ids?.map(id => genres.find(g => g.id === id)?.name || 'Unknown') || [],
      duration: tmdbMovie.runtime,
      language: tmdbMovie.original_language || 'Unknown',
      country: tmdbMovie.production_countries?.[0]?.name || 'Unknown',
      cast: [], // Will be populated separately
      crew: [], // Will be populated separately
      isWatchlisted: false,
      budget: tmdbMovie.budget,
      revenue: tmdbMovie.revenue,
      tmdbId: tmdbMovie.id,
      imdbId: tmdbMovie.imdb_id,
    };
  }

  private transformTMDBTVShow(tmdbShow: TMDBTVShow, genres: TMDBGenre[] = []): TVShow {
    return {
      id: tmdbShow.id.toString(),
      type: 'tv',
      title: tmdbShow.name || 'Unknown Title',
      description: tmdbShow.overview || 'No description available.',
      posterUrl: this.getImageUrl(tmdbShow.poster_path, 'poster', 'w500'),
      backdropUrl: this.getImageUrl(tmdbShow.backdrop_path, 'backdrop', 'w1280'),
      releaseDate: tmdbShow.first_air_date || '',
      rating: tmdbShow.vote_average || 0,
      genres: tmdbShow.genre_ids?.map(id => genres.find(g => g.id === id)?.name || 'Unknown') || [],
      language: tmdbShow.original_language || 'Unknown',
      country: tmdbShow.origin_country?.[0] || 'Unknown',
      cast: [], // Will be populated separately
      crew: [], // Will be populated separately
      isWatchlisted: false,
      numberOfSeasons: tmdbShow.number_of_seasons || 0,
      numberOfEpisodes: tmdbShow.number_of_episodes || 0,
      seasons: [], // Will be populated separately if needed
      status: (tmdbShow.status as TVShow['status']) || 'Returning Series',
      network: tmdbShow.networks?.[0]?.name || 'Unknown',
      firstAirDate: tmdbShow.first_air_date || '',
      lastAirDate: tmdbShow.last_air_date,
    };
  }

  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<Media[]> {
    const response = await this.makeRequest<{ results: (TMDBMovie | TMDBTVShow)[] }>(
      TMDB_ENDPOINTS.trending(mediaType, timeWindow)
    );

    const genres = await this.getGenres(mediaType === 'all' ? 'movie' : mediaType);

    return response.results.map(item => {
      if ('title' in item) {
        return this.transformTMDBMovie(item, genres);
      } else {
        return this.transformTMDBTVShow(item, genres);
      }
    });
  }

  async getPopular(mediaType: 'movie' | 'tv', page: number = 1): Promise<SearchResult> {
    const response = await this.makeRequest<{ 
      results: (TMDBMovie | TMDBTVShow)[]; 
      total_results: number; 
      total_pages: number; 
      page: number; 
    }>(
      TMDB_ENDPOINTS.popular(mediaType),
      { page: page.toString() }
    );

    const genres = await this.getGenres(mediaType);

    const results = response.results.map(item => {
      if (mediaType === 'movie') {
        return this.transformTMDBMovie(item as TMDBMovie, genres);
      } else {
        return this.transformTMDBTVShow(item as TMDBTVShow, genres);
      }
    });

    return {
      results,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      currentPage: response.page,
    };
  }

  async getTopRated(mediaType: 'movie' | 'tv', page: number = 1): Promise<SearchResult> {
    const response = await this.makeRequest<{ 
      results: (TMDBMovie | TMDBTVShow)[]; 
      total_results: number; 
      total_pages: number; 
      page: number; 
    }>(
      TMDB_ENDPOINTS.topRated(mediaType),
      { page: page.toString() }
    );

    const genres = await this.getGenres(mediaType);

    const results = response.results.map(item => {
      if (mediaType === 'movie') {
        return this.transformTMDBMovie(item as TMDBMovie, genres);
      } else {
        return this.transformTMDBTVShow(item as TMDBTVShow, genres);
      }
    });

    return {
      results,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      currentPage: response.page,
    };
  }

  async searchMedia(query: string, mediaType: 'movie' | 'tv' | 'multi' = 'multi', page: number = 1): Promise<SearchResult> {
    const response = await this.makeRequest<{ 
      results: (TMDBMovie | TMDBTVShow)[]; 
      total_results: number; 
      total_pages: number; 
      page: number; 
    }>(
      TMDB_ENDPOINTS.search(mediaType),
      { query, page: page.toString() }
    );

    const movieGenres = await this.getGenres('movie');
    const tvGenres = await this.getGenres('tv');

    const results = response.results.map(item => {
      if ('title' in item) {
        return this.transformTMDBMovie(item, movieGenres);
      } else {
        return this.transformTMDBTVShow(item, tvGenres);
      }
    });

    return {
      results,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      currentPage: response.page,
    };
  }

  async getMediaDetails(id: number, mediaType: 'movie' | 'tv'): Promise<Media> {
    const [details, credits, genres] = await Promise.all([
      this.makeRequest<TMDBMovie | TMDBTVShow>(TMDB_ENDPOINTS.details(mediaType, id)),
      this.makeRequest<TMDBCredits>(TMDB_ENDPOINTS.credits(mediaType, id)),
      this.getGenres(mediaType)
    ]);

    let media: Media;
    if (mediaType === 'movie') {
      media = this.transformTMDBMovie(details as TMDBMovie, genres);
    } else {
      media = this.transformTMDBTVShow(details as TMDBTVShow, genres);
    }

    // Add cast and crew information
    media.cast = credits.cast.slice(0, 10).map(actor => ({
      id: actor.id.toString(),
      name: actor.name,
      character: actor.character,
      profilePath: this.getImageUrl(actor.profile_path, 'profile', 'w185'),
      order: actor.order,
    }));

    media.crew = credits.crew.slice(0, 10).map(member => ({
      id: member.id.toString(),
      name: member.name,
      job: member.job,
      department: member.department,
      profilePath: this.getImageUrl(member.profile_path, 'profile', 'w185'),
    }));

    return media;
  }

  async getGenres(mediaType: 'movie' | 'tv'): Promise<TMDBGenre[]> {
    const response = await this.makeRequest<{ genres: TMDBGenre[] }>(
      TMDB_ENDPOINTS.genres(mediaType)
    );
    return response.genres;
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<SearchResult> {
    const response = await this.makeRequest<{
      results: TMDBMovie[];
      total_pages: number;
      total_results: number;
      page: number;
    }>(
      `${TMDB_ENDPOINTS.discover('movie')}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
    );

    const genres = await this.getGenres('movie');
    const transformedResults = response.results.map(movie => 
      this.transformTMDBMovie(movie, genres)
    );

    return {
      results: transformedResults,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      currentPage: response.page,
    };
  }

  async getTVByGenre(genreId: number, page: number = 1): Promise<SearchResult> {
    const response = await this.makeRequest<{
      results: TMDBTVShow[];
      total_pages: number;
      total_results: number;
      page: number;
    }>(
      `${TMDB_ENDPOINTS.discover('tv')}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
    );

    const genres = await this.getGenres('tv');
    const transformedResults = response.results.map(tvShow => 
      this.transformTMDBTVShow(tvShow, genres)
    );

    return {
      results: transformedResults,
      totalResults: response.total_results,
      totalPages: response.total_pages,
      currentPage: response.page,
    };
  }

  async getRecommendations(id: number, mediaType: 'movie' | 'tv'): Promise<Media[]> {
    const response = await this.makeRequest<{ results: (TMDBMovie | TMDBTVShow)[] }>(
      TMDB_ENDPOINTS.recommendations(mediaType, id)
    );

    const genres = await this.getGenres(mediaType);

    return response.results.slice(0, 12).map(item => {
      if (mediaType === 'movie') {
        return this.transformTMDBMovie(item as TMDBMovie, genres);
      } else {
        return this.transformTMDBTVShow(item as TMDBTVShow, genres);
      }
    });
  }
}

export const tmdbService = new TMDBService();
