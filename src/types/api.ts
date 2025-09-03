import type { Media } from './media';

export interface SearchFilters {
  genre?: string[];
  year?: number;
  rating?: number;
  type?: 'movie' | 'tv' | 'all';
  language?: string;
  sortBy?: 'popularity' | 'rating' | 'release_date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  results: Media[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface StreamingSource {
  quality: 'SD' | 'HD' | '4K';
  url: string;
  type: 'hls' | 'dash' | 'mp4';
  subtitles?: SubtitleTrack[];
}

export interface SubtitleTrack {
  language: string;
  label: string;
  url: string;
  isDefault: boolean;
}
