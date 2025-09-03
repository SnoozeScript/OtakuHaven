/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './App.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
