/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Film,
  Tv,
  Home,
  User,
  Bookmark,
  Heart,
  Clock,
  Star,
  TrendingUp,
  CornerDownLeft,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { tmdbService } from '../../services/tmdbService';
import { logger } from '../../utils';
import type { Media } from '../../types';
import {
  CommandPaletteContext,
  useCommandPalette,
  useCommandPaletteState,
} from './CommandPaletteContext';

// ---------- Provider ----------

export const CommandPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useCommandPaletteState();

  // Lock body scroll while open
  useEffect(() => {
    if (value.isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [value.isOpen]);

  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
};

// ---------- Data: quick actions, recents ----------

interface CommandAction {
  id: string;
  label: string;
  icon: LucideIcon;
  keywords: string;
  path: string;
  gradient: string;
}

const ACTIONS: CommandAction[] = [
  { id: 'home', label: 'Go to Home', icon: Home, keywords: 'home main landing start feed', path: '/', gradient: 'from-blue-400 to-purple-400' },
  { id: 'movies', label: 'Browse Movies', icon: Film, keywords: 'movies films cinema browse popular', path: '/movies', gradient: 'from-yellow-400 to-orange-400' },
  { id: 'tv', label: 'Browse TV Shows', icon: Tv, keywords: 'tv shows series anime episodes browse', path: '/tv-shows', gradient: 'from-green-400 to-teal-400' },
  { id: 'watchlist', label: 'Open Watchlist', icon: Bookmark, keywords: 'watchlist saved queue plan to watch', path: '/watchlist', gradient: 'from-cyan-400 to-blue-400' },
  { id: 'favorites', label: 'Open Favorites', icon: Heart, keywords: 'favorites liked loved collection', path: '/favorites', gradient: 'from-pink-400 to-rose-400' },
  { id: 'profile', label: 'Open Profile', icon: User, keywords: 'profile account user settings', path: '/profile', gradient: 'from-indigo-400 to-purple-400' },
];

const MAX_RECENTS = 6;
const RECENTS_KEY = 'otakuhaven:recentSearches';

const loadRecents = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string').slice(0, MAX_RECENTS) : [];
  } catch {
    return [];
  }
};

const saveRecents = (recents: string[]) => {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  } catch {
    // localStorage unavailable — recents just won't persist
  }
};

// ---------- Palette items ----------

type PaletteItem =
  | { kind: 'recent'; key: string; group: string; query: string }
  | { kind: 'action'; key: string; group: string; action: CommandAction }
  | { kind: 'media'; key: string; group: string; media: Media };

// ---------- Component ----------

export const CommandPalette: React.FC = () => {
  const { isOpen, close } = useCommandPalette();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [searching, setSearching] = useState(false);
  const [trending, setTrending] = useState<Media[]>([]);
  const [recents, setRecents] = useState<string[]>(loadRecents);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trendingFetched = useRef(false);

  // Focus input on open and reset the highlighted row
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Fetch trending once for the idle state
  useEffect(() => {
    if (!isOpen || trendingFetched.current) return;
    trendingFetched.current = true;
    tmdbService
      .getTrending('all', 'week')
      .then(items => setTrending(items.slice(0, 6)))
      .catch(err => {
        trendingFetched.current = false;
        logger.warn('Failed to load trending for palette:', err);
      });
  }, [isOpen]);

  // Debounced TMDB multi-search with stale-response guard and a hard timeout,
  // so a hung request can't leave the palette stuck on a spinner
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      try {
        const request = tmdbService.searchMedia(q, 'multi', 1);
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('search timeout')), 8000)
        );
        const response = await Promise.race([request, timeout]);
        if (!cancelled) {
          setResults(response.results);
          setSearching(false);
        }
      } catch (err) {
        if (!cancelled) {
          setResults([]);
          setSearching(false);
          logger.warn('Command palette search failed:', err);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const pushRecent = useCallback((rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;
    setRecents(prev => {
      const next = [trimmed, ...prev.filter(r => r.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENTS);
      saveRecents(next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    saveRecents([]);
  }, []);

  const navigateToMedia = useCallback(
    (media: Media) => {
      if (media.type === 'movie') {
        navigate({ to: '/movie/$movieId', params: { movieId: media.id } });
      } else {
        navigate({ to: '/tv-show/$showId', params: { showId: media.id } });
      }
    },
    [navigate]
  );

  const handleSelect = useCallback(
    (item: PaletteItem) => {
      if (item.kind === 'action') {
        close();
        navigate({ to: item.action.path });
      } else if (item.kind === 'recent') {
        setQuery(item.query);
        inputRef.current?.focus();
      } else {
        if (query.trim()) pushRecent(query);
        close();
        navigateToMedia(item.media);
      }
    },
    [close, navigate, navigateToMedia, pushRecent, query]
  );

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();
    const list: PaletteItem[] = [];

    if (!q) {
      recents.forEach(r => list.push({ kind: 'recent', key: `recent-${r}`, group: 'Recent Searches', query: r }));
      ACTIONS.forEach(a => list.push({ kind: 'action', key: `action-${a.id}`, group: 'Quick Actions', action: a }));
      trending.forEach(m =>
        list.push({ kind: 'media', key: `trending-${m.type}-${m.id}`, group: 'Trending Now', media: m })
      );
    } else {
      // Typing searches actual content — movies and TV shows only
      results
        .filter(r => r.type === 'movie')
        .slice(0, 6)
        .forEach(m => list.push({ kind: 'media', key: `movie-${m.id}`, group: 'Movies', media: m }));
      results
        .filter(r => r.type === 'tv')
        .slice(0, 6)
        .forEach(m => list.push({ kind: 'media', key: `tv-${m.id}`, group: 'TV Shows', media: m }));
    }

    return list;
  }, [query, recents, trending, results]);

  const clampedIndex = Math.min(activeIndex, Math.max(0, items.length - 1));

  // Keep the highlighted row in view
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-active="true"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [clampedIndex, items]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && items.length > 0) {
      e.preventDefault();
      setActiveIndex((clampedIndex + 1) % items.length);
    } else if (e.key === 'ArrowUp' && items.length > 0) {
      e.preventDefault();
      setActiveIndex((clampedIndex - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[clampedIndex];
      if (item) handleSelect(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  const formatYear = (date: string | undefined) => {
    if (!date) return null;
    const year = new Date(date).getFullYear();
    return Number.isNaN(year) ? null : year;
  };

  const renderRow = (item: PaletteItem, index: number) => {
    const isActive = index === clampedIndex;

    if (item.kind === 'action') {
      const Icon = item.action.icon;
      return (
        <div
          key={item.key}
          data-active={isActive}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => handleSelect(item)}
          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
            isActive ? 'bg-cyan-300/10' : 'hover:bg-white/[0.04]'
          }`}
        >
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.action.gradient} p-[1px] flex-shrink-0`}>
            <div className="w-full h-full rounded-[7px] bg-slate-900 flex items-center justify-center">
              <Icon size={16} className="text-white" />
            </div>
          </div>
          <span className="text-sm font-medium text-white flex-1 truncate">{item.action.label}</span>
          {isActive && <CornerDownLeft size={14} className="text-white/40" />}
        </div>
      );
    }

    if (item.kind === 'recent') {
      return (
        <div
          key={item.key}
          data-active={isActive}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => handleSelect(item)}
          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
            isActive ? 'bg-cyan-300/10' : 'hover:bg-white/[0.04]'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Clock size={15} className="text-white/50" />
          </div>
          <span className="text-sm text-white/90 flex-1 truncate">{item.query}</span>
          {isActive && <CornerDownLeft size={14} className="text-white/40" />}
        </div>
      );
    }

    const isMovie = item.media.type === 'movie';
    const year = formatYear(item.media.releaseDate);

    return (
      <div
        key={item.key}
        data-active={isActive}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => handleSelect(item)}
        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
          isActive ? 'bg-cyan-300/10' : 'hover:bg-white/[0.04]'
        }`}
      >
        <img
          src={item.media.posterUrl}
          alt=""
          className="w-9 h-[52px] rounded-md object-cover bg-slate-800 flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{item.media.title}</div>
          <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
            {year && <span>{year}</span>}
            {item.media.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-current" />
                {item.media.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${
            isMovie ? 'bg-sky-400/20 text-sky-300' : 'bg-violet-400/20 text-violet-300'
          }`}
        >
          {isMovie ? <Film size={10} /> : <Tv size={10} />}
          {isMovie ? 'Movie' : 'TV'}
        </div>
        {isActive && <CornerDownLeft size={14} className="text-white/40 flex-shrink-0" />}
      </div>
    );
  };

  const groupLabel = (group: string) => {
    if (group === 'Trending Now') return (
      <span className="flex items-center gap-1.5">
        <TrendingUp size={11} className="text-yellow-400" />
        Trending This Week
      </span>
    );
    return group;
  };

  const hasQuery = query.trim().length > 0;
  const showSearchSpinner = searching && items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="command-palette-overlay"
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center px-3 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="w-full max-w-xl sm:max-w-2xl mt-[8vh] sm:mt-[12vh] rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search size={18} className="text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search movies, TV shows, or jump to a page..."
                className="flex-1 bg-transparent text-white placeholder-white/35 text-sm sm:text-base outline-none"
                aria-label="Search"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center h-[20px] px-1.5 rounded border border-white/15 bg-white/5 text-[10px] font-medium text-white/50">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto custom-scrollbar py-1.5">
              {showSearchSpinner ? (
                <div className="flex items-center justify-center gap-2 py-10 text-white/50">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Searching…</span>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Search size={20} className="text-white/30" />
                  </div>
                  <p className="text-sm font-medium text-white/80">
                    {hasQuery ? `No results for “${query.trim()}”` : 'Nothing here yet'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {hasQuery ? 'Try different keywords or check your spelling' : 'Start typing to search OtakuHaven'}
                  </p>
                </div>
              ) : (
                items.map((item, index) => {
                  const prevGroup = index > 0 ? items[index - 1].group : null;
                  return (
                    <Fragment key={item.key}>
                      {item.group !== prevGroup && (
                        <div className="flex items-center justify-between px-4 pt-3 pb-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                            {groupLabel(item.group)}
                          </span>
                          {item.group === 'Recent Searches' && recents.length > 1 && (
                            <button
                              onClick={clearRecents}
                              className="text-[11px] text-white/30 hover:text-white/70 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                      {renderRow(item, index)}
                    </Fragment>
                  );
                })
              )}

              {/* Keep quick actions visible while media search is in flight */}
              {searching && items.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 text-white/40">
                  <Loader2 size={13} className="animate-spin" />
                  <span className="text-xs">Searching movies & shows…</span>
                </div>
              )}
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-3 text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center h-[18px] px-1 rounded border border-white/15 bg-white/5 text-[10px]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex items-center h-[18px] px-1 rounded border border-white/15 bg-white/5 text-[10px]">↵</kbd>
                  open
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <kbd className="inline-flex items-center h-[18px] px-1 rounded border border-white/15 bg-white/5 text-[10px]">esc</kbd>
                  close
                </span>
              </div>
              <span className="text-[11px] text-white/30">
                {hasQuery && results.length > 0
                  ? `${results.length} result${results.length === 1 ? '' : 's'}`
                  : 'OtakuHaven Search'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
