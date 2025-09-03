/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Film, Tv, Home, User } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { SearchModal } from './SearchModal';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

interface MagneticDockProps {
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
}

interface DockItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

export const MagneticDock: React.FC<MagneticDockProps> = ({ onSearch, onNavigate }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { currentUser } = useAuth();

  const dockItems: DockItem[] = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, path: '/', color: 'from-blue-400 to-purple-400' },
    { id: 'movies', label: 'Movies', icon: Film, path: '/movies', color: 'from-yellow-400 to-orange-400' },
    { id: 'tv-shows', label: 'TV Shows', icon: Tv, path: '/tv-shows', color: 'from-green-400 to-teal-400' },
    { id: 'search', label: 'Search', icon: Search, path: '/search', color: 'from-purple-400 to-indigo-400' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', color: 'from-indigo-400 to-purple-400' },
  ], []);

  // Update active item based on current route with better pattern matching
  useEffect(() => {
    const currentPath = routerState.location.pathname;
    
    // Define route patterns for better matching
    let activeId = 'home'; // default
    
    if (currentPath === '/') {
      activeId = 'home';
    } else if (currentPath.startsWith('/movie')) {
      activeId = 'movies';
    } else if (currentPath.startsWith('/tv')) {
      activeId = 'tv-shows';
    } else if (currentPath.startsWith('/movies')) {
      activeId = 'movies';
    } else if (currentPath.startsWith('/tv-shows')) {
      activeId = 'tv-shows';
    } else if (currentPath.startsWith('/profile')) {
      activeId = 'profile';
    } else {
      // Try exact match as fallback
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
      setIsSearchOpen(true);
    } else if (protectedRoutes.includes(item.id) && !currentUser) {
      // Show login modal for protected routes when user is not logged in
      setIsAuthOpen(true);
    } else {
      setActiveItem(item.id);
      navigate({ to: item.path });
      onNavigate?.(item.path);
    }
  };

  const handleMouseMove = () => {
    // Mouse tracking for future enhancements
  };

  const getItemScale = (itemIndex: number, hoveredIndex: number | null) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(itemIndex - hoveredIndex);
    // Better mobile-friendly scale effects with improved touch targets
    if (distance === 0) return window.innerWidth < 640 ? 1.1 : 1.4;
    if (distance === 1) return window.innerWidth < 640 ? 1.05 : 1.2;
    if (distance === 2) return window.innerWidth < 640 ? 1.02 : 1.1;
    return 1;
  };

  const getItemTransform = (itemIndex: number, hoveredIndex: number | null) => {
    if (hoveredIndex === null) return 'translateY(0)';
    const distance = Math.abs(itemIndex - hoveredIndex);
    // Subtle transform effects for better mobile experience
    if (distance === 0) return window.innerWidth < 640 ? 'translateY(-2px)' : 'translateY(-8px)';
    if (distance === 1) return window.innerWidth < 640 ? 'translateY(-1px)' : 'translateY(-4px)';
    return 'translateY(0)';
  };

  return (
    <>
      {/* Simple Brand Text - Responsive */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40">
        <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
          OtakuHaven
        </span>
      </div>

      {/* Magnetic Dock - Responsive with Better Mobile Spacing */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 sm:bottom-6">
        <div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredItem(null)}
          className="bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-3 sm:p-3 shadow-2xl"
        >
          <div className="flex items-end gap-3 sm:gap-2">
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;
              const hoveredIndex = hoveredItem ? dockItems.findIndex(i => i.id === hoveredItem) : null;
              const scale = getItemScale(index, hoveredIndex);
              const transform = getItemTransform(index, hoveredIndex);

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    className={`relative w-12 h-12 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 ease-out ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} shadow-lg`
                        : 'bg-white/10 hover:bg-white/20 active:bg-white/30'
                    }`}
                    style={{
                      transform: `${transform} scale(${scale})`,
                    }}
                  >
                    <Icon 
                      size={20} 
                      className={`sm:w-5 sm:h-5 ${
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                      } transition-colors`} 
                    />
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </button>

                  {/* Tooltip - Hidden on mobile */}
                  {isHovered && (
                    <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap">
                      {item.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onSearch={onSearch}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
