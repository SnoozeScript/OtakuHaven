/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Film, Tv, Home, User } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCommandPalette } from './CommandPaletteContext';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

interface MagneticDockProps {
  onNavigate?: (path: string) => void;
}

interface DockItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

export const MagneticDock: React.FC<MagneticDockProps> = ({ onNavigate }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { currentUser } = useAuth();
  const { open: openCommandPalette } = useCommandPalette();

  const dockItems: DockItem[] = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'movies', label: 'Movies', icon: Film, path: '/movies' },
    { id: 'tv-shows', label: 'TV Shows', icon: Tv, path: '/tv-shows' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ], []);

  // Update active item based on current route
  useEffect(() => {
    const currentPath = routerState.location.pathname;

    let activeId = 'home';

    if (currentPath === '/') {
      activeId = 'home';
    } else if (currentPath.startsWith('/movies') || currentPath.startsWith('/movie')) {
      activeId = 'movies';
    } else if (currentPath.startsWith('/tv')) {
      activeId = 'tv-shows';
    } else if (currentPath.startsWith('/profile')) {
      activeId = 'profile';
    } else {
      const currentItem = dockItems.find(item => item.path === currentPath);
      if (currentItem) {
        activeId = currentItem.id;
      }
    }

    setActiveItem(activeId);
  }, [routerState.location.pathname, dockItems]);

  const handleItemClick = (item: DockItem) => {
    const protectedRoutes = ['profile'];

    if (item.id === 'search') {
      openCommandPalette();
    } else if (protectedRoutes.includes(item.id) && !currentUser) {
      setIsAuthOpen(true);
    } else {
      setActiveItem(item.id);
      navigate({ to: item.path });
      onNavigate?.(item.path);
    }
  };

  const getItemScale = (itemIndex: number, hoveredIndex: number | null) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(itemIndex - hoveredIndex);
    if (distance === 0) return window.innerWidth < 640 ? 1.1 : 1.35;
    if (distance === 1) return window.innerWidth < 640 ? 1.05 : 1.15;
    if (distance === 2) return window.innerWidth < 640 ? 1.02 : 1.06;
    return 1;
  };

  const getItemTransform = (itemIndex: number, hoveredIndex: number | null) => {
    if (hoveredIndex === null) return 'translateY(0)';
    const distance = Math.abs(itemIndex - hoveredIndex);
    if (distance === 0) return window.innerWidth < 640 ? 'translateY(-3px)' : 'translateY(-8px)';
    if (distance === 1) return window.innerWidth < 640 ? 'translateY(-1px)' : 'translateY(-4px)';
    return 'translateY(0)';
  };

  return (
    <>
      {/* Brand */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40">
        <span className="font-bold text-lg sm:text-xl tracking-tight text-brand select-none">
          OtakuHaven
        </span>
      </div>

      {/* Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div
          ref={dockRef}
          onMouseLeave={() => setHoveredItem(null)}
          className="glass-strong rounded-2xl px-2.5 py-2 shadow-card"
        >
          <div className="flex items-end gap-2.5 sm:gap-3">
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;
              const hoveredIndex = hoveredItem ? dockItems.findIndex(i => i.id === hoveredItem) : null;
              const scale = getItemScale(index, hoveredIndex);
              const transform = getItemTransform(index, hoveredIndex);

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    aria-label={item.label}
                    className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ease-out ${
                      isActive
                        ? 'bg-brand shadow-glow-sm'
                        : isHovered
                          ? 'bg-white/12'
                          : 'bg-white/[0.06] hover:bg-white/10'
                    }`}
                    style={{ transform: `${transform} scale(${scale})` }}
                  >
                    <Icon
                      size={19}
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-white/65'
                      }`}
                    />

                    {/* Active dot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-300" />
                    )}
                  </button>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1 rounded-lg glass-strong text-xs font-medium text-white whitespace-nowrap">
                      {item.id === 'search' ? 'Search ⌘K' : item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
