/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { ReactiveGridBackground } from '../components/backgrounds/ReactiveGridBackground';
import { MagneticDock } from '../components/layout/MagneticDock';
import { Footer } from '../components/layout/Footer';
import { RouterDevtools } from '../components/dev/RouterDevtools';
import { HomePage } from '../pages/HomePage';
import { MovieDetails } from '../pages/MovieDetails';
import { TVShowDetails } from '../pages/TVShowDetails';
import { ProfilePage } from '../pages/ProfilePage';
import MoviesPage from '../pages/MoviesPage';
import TVShowsPage from '../pages/TVShowsPage';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 relative">
      <ReactiveGridBackground />
      <MagneticDock />
      <main>
        <Outlet />
      </main>
      <Footer />
      <RouterDevtools />
    </div>
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
    <div className="min-h-screen bg-black text-white pt-20 pb-32 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          Favorites Page
        </h1>
        <p className="text-white/60">Coming soon...</p>
      </div>
    </div>
  ),
});

// Watchlist route
const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: () => (
    <div className="min-h-screen bg-black text-white pt-20 pb-32 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Watchlist Page
        </h1>
        <p className="text-white/60">Coming soon...</p>
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
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
