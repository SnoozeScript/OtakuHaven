/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React from 'react';
import { Heart, Github, Film } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-8 border-t border-white/[0.06]">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-glow-sm">
                <Film size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand">OtakuHaven</span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Your ultimate destination for discovering amazing movies and TV shows — thousands of
              titles with ratings, details, and one-tap playback.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/35">
              Made with <Heart size={12} className="text-pink-400 fill-pink-400" /> for movie lovers
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:justify-self-center">
            <h4 className="eyebrow">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: '/' },
                { name: 'Movies', href: '/movies' },
                { name: 'TV Shows', href: '/tv-shows' },
                { name: 'Profile', href: '/profile' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/55 hover:text-cyan-300 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3 md:justify-self-end">
            <h4 className="eyebrow">Connect</h4>
            <p className="text-white/45 text-sm max-w-xs">
              Follow along for updates and fresh recommendations.
            </p>
            <a
              href="https://github.com/SnoozeScript/OtakuHaven"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:border-cyan-300/30 text-sm text-white/80 hover:text-white transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/35">
          <span>© {currentYear} OtakuHaven. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 hover:text-cyan-300 transition-colors"
            >
              TMDB API
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
