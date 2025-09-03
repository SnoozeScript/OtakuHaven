import React from 'react';
import { MediaCard } from './MediaCard';
import type { Media } from '../../types';

interface MediaGridProps {
  media: Media[];
  loading?: boolean;
  error?: string | null;
  onMediaClick?: (media: Media) => void;
  showProgress?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  title?: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  loading = false,
  error = null,
  onMediaClick,
  showProgress = false,
  columns = 5,
  title
}) => {
  const getGridColumns = (columns: number) => {
    const columnMap = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-2 sm:grid-cols-3',
      4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
    };
    return columnMap[columns as keyof typeof columnMap] || columnMap[5];
  };

  if (loading) {
    return (
      <div className="mb-12">
        {title && <h2 className="text-white text-3xl font-semibold mb-6 px-4">{title}</h2>}
        <div className="flex flex-col items-center justify-center py-12 text-white/80">
          <div className="w-12 h-12 border-4 border-white/20 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        {title && <h2 className="text-white text-3xl font-semibold mb-6 px-4">{title}</h2>}
        <div className="flex flex-col items-center justify-center py-12 text-center text-white/80">
          <p className="text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="mb-12">
        {title && <h2 className="text-white text-3xl font-semibold mb-6 px-4">{title}</h2>}
        <div className="flex flex-col items-center justify-center py-12 text-white/80">
          <p className="text-lg">No content found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {title && <h2 className="text-white text-3xl font-semibold mb-6 px-4">{title}</h2>}
      <div className={`grid gap-6 px-4 ${getGridColumns(columns)}`}>
        {media.filter(item => item && item.id).map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onClick={onMediaClick}
            showProgress={showProgress}
          />
        ))}
      </div>
    </div>
  );
};
