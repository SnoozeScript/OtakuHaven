/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, Tv, Loader2, ChevronDown, Star, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTMDBSearch } from '../../hooks/useTMDB';
import type { Media } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'multi' | 'movie' | 'tv'>('multi');
  const [displayedResults, setDisplayedResults] = useState<Media[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const navigate = useNavigate();
  const { data: searchResults, loading } = useTMDBSearch(query, selectedType, currentPage);

  // Custom Card Component
  const SearchCard: React.FC<{ media: Media }> = ({ media }) => {
    const handleClick = () => {
      if (media.type === 'movie') {
        navigate({ to: '/movie/$movieId', params: { movieId: media.id } });
      } else if (media.type === 'tv') {
        navigate({ to: '/tv-show/$showId', params: { showId: media.id } });
      }
      onClose();
    };

    const formatRating = (rating: number | undefined | null) => {
      if (rating === undefined || rating === null || isNaN(rating)) {
        return 'N/A';
      }
      return rating.toFixed(1);
    };

    const getYear = (date: string | undefined) => {
      if (!date) return 'N/A';
      return new Date(date).getFullYear();
    };

    return (
      <div 
        onClick={handleClick}
        className="group relative bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 touch-manipulation"
      >
        {/* Image */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={media.posterUrl}
            alt={media.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Mobile-optimized overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 left-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                media.type === 'movie' 
                  ? 'bg-blue-500/90 text-white' 
                  : 'bg-purple-500/90 text-white'
              }`}>
                {media.type === 'movie' ? <Film size={10} /> : <Tv size={10} />}
                <span className="hidden sm:inline">{media.type === 'movie' ? 'Movie' : 'TV Show'}</span>
              </div>
            </div>
            
            {/* Rating badge */}
            {media.rating && media.rating > 0 && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/70 rounded-md text-xs text-white">
                  <Star size={8} className="text-yellow-400 fill-current" />
                  <span>{formatRating(media.rating)}</span>
                </div>
              </div>
            )}
            
            {/* Bottom info - always visible on mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-white font-medium text-xs sm:text-sm mb-1 line-clamp-2 leading-tight">
                {media.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <Calendar size={8} />
                <span>{getYear(media.releaseDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Reset displayed results when query or type changes
  useEffect(() => {
    if (searchResults?.results) {
      if (currentPage === 1) {
        setDisplayedResults(searchResults.results);
      } else {
        setDisplayedResults(prev => [...prev, ...searchResults.results]);
      }
    }
    setIsLoadingMore(false);
  }, [searchResults, currentPage]);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDisplayedResults([]);
      setCurrentPage(1);
    }
  }, [isOpen]);

  // Reset page when query or type changes
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedResults([]);
  }, [query, selectedType]);

  // Call onSearch when query changes
  useEffect(() => {
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && searchResults && currentPage < searchResults.totalPages) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, searchResults, currentPage]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full h-full bg-gradient-to-br from-slate-900 to-gray-900 backdrop-blur-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile-optimized header */}
            <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-gray-800/20 via-gray-900/30 to-gray-800/20 border-b border-gray-700/20">
              <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 min-w-0">
                  <div className="min-w-0 hidden sm:block">
                    <h1 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">
                      Search & Discover
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium hidden lg:block">Find your next favorite content</p>
                  </div>
                </div>
                
                {/* Mobile-optimized search input */}
                <div className="flex-1 flex justify-center max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-2">
                  <div className="relative w-full">
                    <div className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-gray-800/50 border border-gray-600/30 rounded-lg pl-8 sm:pl-10 md:pl-12 pr-8 sm:pr-10 md:pr-12 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                      autoFocus
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 hover:bg-gray-700/50 rounded-md transition-all duration-200 touch-manipulation"
                      >
                        <X size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400 hover:text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile-optimized type filter */}
                <div className="flex bg-gray-800/30 rounded-lg p-0.5 sm:p-1 border border-gray-700/20 backdrop-blur-sm flex-shrink-0">
                  {[
                    { value: 'multi', label: 'All', icon: Search },
                    { value: 'movie', label: 'Movies', icon: Film },
                    { value: 'tv', label: 'TV Shows', icon: Tv }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedType(value as 'multi' | 'movie' | 'tv')}
                      className={`flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-1.5 sm:px-2 md:px-3 lg:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation min-h-[32px] sm:min-h-[36px] md:min-h-[40px] ${
                        selectedType === value
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                      }`}
                    >
                      <Icon size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                      <span className="hidden md:inline">{label}</span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 md:p-2.5 hover:bg-gray-700/40 rounded-lg transition-all duration-300 border border-gray-600/20 hover:border-gray-500/40 group flex-shrink-0 touch-manipulation min-h-[32px] sm:min-h-[36px] md:min-h-[40px] lg:min-h-[44px] min-w-[32px] sm:min-w-[36px] md:min-w-[40px] lg:min-w-[44px] flex items-center justify-center"
                >
                  <X size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Mobile-optimized results grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading && currentPage === 1 ? (
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
                    {Array.from({ length: 24 }).map((_, index) => (
                      <div 
                        key={index}
                        className="aspect-[2/3] bg-gradient-to-b from-gray-800/30 to-gray-900/50 rounded-lg animate-pulse border border-gray-700/20"
                      />
                    ))}
                  </div>
                </div>
              ) : query && displayedResults.length > 0 ? (
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
                    {displayedResults.slice(0, currentPage * 24).map((item: Media, index: number) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative transform transition-all duration-300 hover:scale-105 active:scale-95">
                          <SearchCard media={item} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mobile-optimized load more button */}
                  {searchResults && searchResults.totalPages > currentPage && (
                    <div className="flex flex-col items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/30">
                      <button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-800/60 to-gray-700/60 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl border border-gray-600/30 hover:border-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm touch-manipulation min-h-[44px]"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-400" />
                            <span className="text-white font-medium text-sm">Loading...</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            <span className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm">
                              Load More
                            </span>
                            <div className="px-2 sm:px-3 py-1 bg-gray-700/50 rounded-lg border border-gray-600/30">
                              <span className="text-xs text-gray-400">
                                {displayedResults.length} / {searchResults.totalResults.toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : query && !loading ? (
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                  <div className="text-center max-w-md">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-gray-700/20">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">No results found</h3>
                    <p className="text-gray-400 text-sm">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                  <div className="text-center max-w-lg">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-blue-400/20">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">Start your discovery</h3>
                    <p className="text-gray-400 text-sm">
                      Search for movies, TV shows, or people
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
