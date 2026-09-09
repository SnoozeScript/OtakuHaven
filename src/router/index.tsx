/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { lazy, Suspense } from 'react';
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { ReactiveGridBackground } from '../components/backgrounds/ReactiveGridBackground';
import { MagneticDock } from '../components/layout/MagneticDock';
import { Footer } from '../components/layout/Footer';
import { CommandPalette, CommandPaletteProvider } from '../components/layout/CommandPalette';
import { RouterDevtools } from '../components/dev/RouterDevtools';

// Lazy load page components for better initial load performance
const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })));
const MovieDetails = lazy(() => import('../pages/MovieDetails').then(m => ({ default: m.MovieDetails })));
const TVShowDetails = lazy(() => import('../pages/TVShowDetails').then(m => ({ default: m.TVShowDetails })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MoviesPage = lazy(() => import('../pages/MoviesPage'));
const TVShowsPage = lazy(() => import('../pages/TVShowsPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-14 h-14 rounded-full border-[3px] border-white/10 border-t-cyan-300 animate-spin" />
  </div>
);

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <CommandPaletteProvider>
      <div className="min-h-screen relative flex flex-col">
        <ReactiveGridBackground />
        <MagneticDock />
        <main className="flex-1 relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
        <CommandPalette />
        <RouterDevtools />
      </div>
    </CommandPaletteProvider>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Movie details route with dynamic ID
const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movie/$movieId',
  component: () => {
    const { movieId } = movieRoute.useParams();
    return (
      <MovieDetails 
        movieId={movieId} 
        onBack={() => window.history.back()}
      />
    );
  },
});

// Movies listing route
const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies',
  component: MoviesPage,
});

// TV Shows listing route
const tvShowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tv-shows',
  component: TVShowsPage,
});

// TV Show details route with dynamic ID
const tvShowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tv-show/$showId',
  component: () => {
    const { showId } = tvShowRoute.useParams();
    return (
      <TVShowDetails 
        showId={showId} 
        onBack={() => window.history.back()}
      />
    );
  },
});

// Favorites route
const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: () => (
    <div className="min-h-screen pt-24 pb-32 flex items-center justify-center px-4">
      <div className="glass rounded-3xl px-8 py-12 text-center max-w-md">
        <div className="text-5xl mb-4">💖</div>
        <h1 className="text-2xl font-bold mb-2 text-white">Favorites</h1>
        <p className="text-white/45 text-sm">Your liked titles will live here — coming soon.</p>
      </div>
    </div>
  ),
});

// Watchlist route
const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: () => (
    <div className="min-h-screen pt-24 pb-32 flex items-center justify-center px-4">
      <div className="glass rounded-3xl px-8 py-12 text-center max-w-md">
        <div className="text-5xl mb-4">🔖</div>
        <h1 className="text-2xl font-bold mb-2 text-white">Watchlist</h1>
        <p className="text-white/45 text-sm">Your saved titles will live here — coming soon.</p>
      </div>
    </div>
  ),
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  movieRoute,
  moviesRoute,
  tvShowsRoute,
  tvShowRoute,
  favoritesRoute,
  watchlistRoute,
  profileRoute,
]);

// Create router
export const router = createRouter({ routeTree, scrollRestoration: true });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
