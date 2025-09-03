import type { Media, SearchFilters, SearchResult, ApiResponse } from '../types';
import { API_CONFIG } from '../constants';

class MediaService {
  private baseUrl = API_CONFIG.baseUrl;

  async getTrending(type: 'movie' | 'tv' | 'all' = 'all'): Promise<Media[]> {
    try {
      const response = await fetch(`${this.baseUrl}/trending/${type}`);
      const data: ApiResponse<Media[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching trending media:', error);
      throw error;
    }
  }

  async getPopular(type: 'movie' | 'tv' = 'movie', page: number = 1): Promise<SearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/${type}/popular?page=${page}`);
      const data: ApiResponse<SearchResult> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching popular media:', error);
      throw error;
    }
  }

  async getMediaById(id: string, type: 'movie' | 'tv'): Promise<Media> {
    try {
      const response = await fetch(`${this.baseUrl}/${type}/${id}`);
      const data: ApiResponse<Media> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching media by ID:', error);
      throw error;
    }
  }

  async searchMedia(query: string, filters?: SearchFilters): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/search?${params}`);
      const data: ApiResponse<SearchResult> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching media:', error);
      throw error;
    }
  }

  async getRecommendations(mediaId: string, type: 'movie' | 'tv'): Promise<Media[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${type}/${mediaId}/recommendations`);
      const data: ApiResponse<Media[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  async getGenres(type: 'movie' | 'tv' = 'movie'): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${type}/genres`);
      const data: ApiResponse<{ id: string; name: string }[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }
}

export const mediaService = new MediaService();
