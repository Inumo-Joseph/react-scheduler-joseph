import { useState, useEffect, useRef, useCallback } from "react";

interface UseIncrementalRenderOptions {
  /** Number of items to render in each batch */
  batchSize?: number;
  /** Delay between batches in ms (0 uses requestIdleCallback) */
  batchDelay?: number;
  /** Whether to reset when items change */
  resetOnChange?: boolean;
}

interface UseIncrementalRenderResult<T> {
  /** Items that should be rendered now */
  visibleItems: T[];
  /** Whether all items have been loaded */
  isComplete: boolean;
  /** Progress from 0 to 1 */
  progress: number;
  /** Number of items currently visible */
  visibleCount: number;
  /** Total number of items */
  totalCount: number;
  /** Force load all remaining items immediately */
  loadAll: () => void;
  /** Reset and start loading from beginning */
  reset: () => void;
}

/**
 * Hook for progressively rendering large lists to avoid blocking the main thread.
 * Renders items in batches using requestIdleCallback for smooth UI.
 */
export function useIncrementalRender<T>(
  items: T[],
  options: UseIncrementalRenderOptions = {}
): UseIncrementalRenderResult<T> {
  const { batchSize = 15, batchDelay = 0, resetOnChange = true } = options;

  const [visibleCount, setVisibleCount] = useState(() => Math.min(batchSize, items.length));
  const itemsRef = useRef(items);
  const isLoadingRef = useRef(false);
  const idleCallbackRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCount = items.length;
  const isComplete = visibleCount >= totalCount;
  const progress = totalCount > 0 ? visibleCount / totalCount : 1;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (idleCallbackRef.current !== null) {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleCallbackRef.current);
      }
      idleCallbackRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Load next batch
  const loadNextBatch = useCallback(() => {
    if (isLoadingRef.current) return;

    setVisibleCount((prev) => {
      const next = Math.min(prev + batchSize, totalCount);
      if (next >= totalCount) {
        isLoadingRef.current = false;
      }
      return next;
    });
  }, [batchSize, totalCount]);

  // Schedule next batch using requestIdleCallback or setTimeout
  const scheduleNextBatch = useCallback(() => {
    if (isComplete || isLoadingRef.current) return;

    isLoadingRef.current = true;

    if (batchDelay === 0 && typeof requestIdleCallback !== "undefined") {
      // Use requestIdleCallback for smooth rendering
      idleCallbackRef.current = requestIdleCallback(
        (deadline) => {
          // Load batches while we have idle time
          while (deadline.timeRemaining() > 5 && visibleCount < totalCount) {
            loadNextBatch();
          }
          isLoadingRef.current = false;

          // Schedule more if not complete
          if (visibleCount < totalCount) {
            scheduleNextBatch();
          }
        },
        { timeout: 100 } // Ensure we make progress even if busy
      );
    } else {
      // Fallback to setTimeout
      timeoutRef.current = setTimeout(() => {
        loadNextBatch();
        isLoadingRef.current = false;

        // Schedule more if not complete
        if (visibleCount < totalCount) {
          scheduleNextBatch();
        }
      }, batchDelay || 16); // ~1 frame if no delay specified
    }
  }, [isComplete, batchDelay, loadNextBatch, visibleCount, totalCount]);

  // Load all remaining items immediately
  const loadAll = useCallback(() => {
    cleanup();
    setVisibleCount(totalCount);
  }, [cleanup, totalCount]);

  // Reset to initial state
  const reset = useCallback(() => {
    cleanup();
    isLoadingRef.current = false;
    setVisibleCount(Math.min(batchSize, totalCount));
  }, [cleanup, batchSize, totalCount]);

  // Handle items change
  useEffect(() => {
    if (resetOnChange && items !== itemsRef.current) {
      itemsRef.current = items;
      cleanup();
      isLoadingRef.current = false;
      setVisibleCount(Math.min(batchSize, items.length));
    }
  }, [items, resetOnChange, batchSize, cleanup]);

  // Start loading more batches
  useEffect(() => {
    if (!isComplete && !isLoadingRef.current) {
      // Small delay to let initial render complete
      const initialDelay = setTimeout(() => {
        scheduleNextBatch();
      }, 50);

      return () => clearTimeout(initialDelay);
    }
  }, [isComplete, scheduleNextBatch]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Return visible slice of items
  const visibleItems = items.slice(0, visibleCount);

  return {
    visibleItems,
    isComplete,
    progress,
    visibleCount,
    totalCount,
    loadAll,
    reset
  };
}

export default useIncrementalRender;
