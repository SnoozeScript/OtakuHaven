/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React, { memo } from 'react';

/**
 * Ambient "aurora" backdrop: a deep-space base with three slowly drifting
 * color fields and a soft vignette. Pure CSS — no per-frame JS work.
 */
export const ReactiveGridBackground: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Aurora fields */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-25 animate-aurora-a"
        style={{ background: 'radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, transparent 65%)' }}
      />
      <div
        className="absolute top-1/3 -right-1/4 w-[65vw] h-[65vw] rounded-full opacity-20 animate-aurora-b"
        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.55) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-1/3 left-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.13] animate-aurora-c"
        style={{ background: 'radial-gradient(circle, rgba(232, 121, 249, 0.5) 0%, transparent 65%)' }}
      />

      {/* Vignette to keep edges dark and content readable */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(4, 6, 13, 0.85) 100%)' }}
      />
    </div>
  );
});
