/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 SnoozeScript
 */

// Secure logging utility for production safety
class SecureLogger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  log(...args: unknown[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]) {
    if (this.isDevelopment) {
      console.warn(...args);
    }
  }

  error(...args: unknown[]) {
    if (this.isDevelopment) {
      console.error(...args);
    }
    // In production, errors are silently ignored for security
    // Consider integrating with external logging service like Sentry
  }

  info(...args: unknown[]) {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args: unknown[]) {
    if (this.isDevelopment) {
      console.debug(...args);
    }
  }

  // Method to completely disable console in production
  disableConsoleInProduction() {
    if (this.isProduction) {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.info = () => {};
      console.debug = () => {};
      console.trace = () => {};
      console.table = () => {};
      console.group = () => {};
      console.groupEnd = () => {};
      console.time = () => {};
      console.timeEnd = () => {};
    }
  }
}

export const logger = new SecureLogger();

// Disable console in production
logger.disableConsoleInProduction();
