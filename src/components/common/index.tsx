/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

// ---------- Page header (Movies / TV Shows / Profile) ----------

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, icon: Icon, iconClassName = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center gap-4"
  >
    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
      <Icon size={22} className={`text-cyan-300 ${iconClassName}`} />
    </div>
    <div>
      <p className="eyebrow mb-0.5">{eyebrow}</p>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
    </div>
  </motion.div>
);

// ---------- Section heading (rows on Home / genre rows) ----------

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  delay?: number;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3"
  >
    {Icon && (
      <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-cyan-300" />
      </div>
    )}
    <div>
      {subtitle && <p className="eyebrow mb-0.5">{subtitle}</p>}
      <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
    </div>
  </motion.div>
);

// ---------- Poster skeleton ----------

export const PosterSkeleton: React.FC<{ className?: string }> = ({ className = 'w-full aspect-[2/3]' }) => (
  <div className={`shimmer rounded-2xl ${className}`} />
);

// ---------- Empty state ----------

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, children }) => (
  <div className="glass rounded-2xl px-6 py-12 sm:py-16 text-center">
    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
      <Icon size={24} className="text-white/35" />
    </div>
    <h3 className="text-white font-semibold text-lg mb-1.5">{title}</h3>
    <p className="text-white/45 text-sm max-w-sm mx-auto">{description}</p>
    {children && <div className="mt-5">{children}</div>}
  </div>
);

// ---------- Type chip (Movie / TV) ----------

export const TypeChip: React.FC<{ type: 'movie' | 'tv'; label?: string; className?: string }> = ({
  type,
  label,
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md ${
      type === 'movie' ? 'bg-sky-400/20 text-sky-300' : 'bg-violet-400/20 text-violet-300'
    } ${className}`}
  >
    {label ?? (type === 'movie' ? 'Movie' : 'TV')}
  </span>
);
