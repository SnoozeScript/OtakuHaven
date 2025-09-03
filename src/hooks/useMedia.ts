import { useState, useEffect } from 'react';
import type { Media } from '../types';
import { mediaService } from '../services';

export const useMedia = (id: string, type: 'movie' | 'tv') => {
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mediaService.getMediaById(id, type);
        setMedia(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchMedia();
    }
  }, [id, type]);

  return { media, loading, error };
};
