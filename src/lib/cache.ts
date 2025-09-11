/**
 * Caching utilities for static content and API responses
 */

// In-memory cache for client-side
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Browser storage cache
export class StorageCache {
  private storage: Storage;
  private prefix: string;

  constructor(storage: Storage = localStorage, prefix: string = 'sces_') {
    this.storage = storage;
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set(key: string, data: any, ttlMs: number = 24 * 60 * 60 * 1000) { // 24 hours default
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
      };
      this.storage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache item:', error);
    }
  }

  get(key: string) {
    try {
      const itemStr = this.storage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now - item.timestamp > item.ttl) {
        this.storage.removeItem(this.getKey(key));
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to get cache item:', error);
      return null;
    }
  }

  delete(key: string) {
    try {
      this.storage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('Failed to delete cache item:', error);
    }
  }

  clear() {
    try {
      const keys = Object.keys(this.storage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

// Create storage cache instances
export const localCache = typeof window !== 'undefined' 
  ? new StorageCache(localStorage, 'sces_local_')
  : null;

export const sessionCache = typeof window !== 'undefined'
  ? new StorageCache(sessionStorage, 'sces_session_')
  : null;

// Cache wrapper for API calls
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    storage?: 'memory' | 'local' | 'session';
    forceRefresh?: boolean;
  } = {}
): Promise<T> {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    storage = 'memory',
    forceRefresh = false,
  } = options;

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    let cached: T | null = null;

    switch (storage) {
      case 'memory':
        cached = memoryCache.get(key);
        break;
      case 'local':
        cached = localCache?.get(key) || null;
        break;
      case 'session':
        cached = sessionCache?.get(key) || null;
        break;
    }

    if (cached !== null) {
      return cached;
    }
  }

  // Fetch fresh data
  try {
    const data = await fetcher();

    // Cache the result
    switch (storage) {
      case 'memory':
        memoryCache.set(key, data, ttl);
        break;
      case 'local':
        localCache?.set(key, data, ttl);
        break;
      case 'session':
        sessionCache?.set(key, data, ttl);
        break;
    }

    return data;
  } catch (error) {
    // Try to return stale data on error
    let staleData: T | null = null;

    switch (storage) {
      case 'memory':
        staleData = memoryCache.get(key);
        break;
      case 'local':
        staleData = localCache?.get(key) || null;
        break;
      case 'session':
        staleData = sessionCache?.get(key) || null;
        break;
    }

    if (staleData !== null) {
      console.warn('Returning stale data due to fetch error:', error);
      return staleData;
    }

    throw error;
  }
}

// Preload cache with critical data
export function preloadCache(entries: Array<{ key: string; fetcher: () => Promise<any>; options?: any }>) {
  if (typeof window === 'undefined') return;

  entries.forEach(({ key, fetcher, options }) => {
    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        withCache(key, fetcher, options).catch(console.warn);
      });
    } else {
      // Fallback to setTimeout
      setTimeout(() => {
        withCache(key, fetcher, options).catch(console.warn);
      }, 100);
    }
  });
}

// Cache cleanup utility
export function setupCacheCleanup() {
  if (typeof window === 'undefined') return;

  // Clean memory cache every 10 minutes
  const memoryCleanupInterval = setInterval(() => {
    memoryCache.cleanup();
  }, 10 * 60 * 1000);

  // Clean up on page unload
  const handleBeforeUnload = () => {
    clearInterval(memoryCleanupInterval);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearInterval(memoryCleanupInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}