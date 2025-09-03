/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import React from 'react';
import { motion } from 'framer-motion';

export const ReactiveGridBackground: React.FC = () => {
  const gridCols = 40;
  const gridRows = 25;
  const gridItems = [];

  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      gridItems.push({ x: i, y: j, id: `${i}-${j}` });
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0">
        {gridItems.map((item) => {
          // Simple uniform delay pattern
          const delay = (item.x + item.y) * 0.02;
          
          return (
            <motion.div
              key={item.id}
              className="absolute w-0.5 h-0.5 bg-cyan-400/25 rounded-full"
              style={{
                left: `${(item.x / gridCols) * 100}%`,
                top: `${(item.y / gridRows) * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{
                duration: 4,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Simple dock connection indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-t from-purple-400/40 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
