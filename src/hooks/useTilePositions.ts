import { useState, useCallback } from "react";

export type TilePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TilePositionMap = Record<string, TilePosition>;

interface UseTilePositionsResult {
  tilePositions: TilePositionMap;
  updatePosition: (id: string, position: TilePosition) => void;
  removePosition: (id: string) => void;
  clearPositions: () => void;
}

/**
 * Simple hook for managing tile positions.
 */
export function useTilePositions(): UseTilePositionsResult {
  const [tilePositions, setTilePositions] = useState<TilePositionMap>({});

  const updatePosition = useCallback((id: string, position: TilePosition) => {
    setTilePositions((prev) => ({
      ...prev,
      [id]: position
    }));
  }, []);

  const removePosition = useCallback((id: string) => {
    setTilePositions((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearPositions = useCallback(() => {
    setTilePositions({});
  }, []);

  return {
    tilePositions,
    updatePosition,
    removePosition,
    clearPositions
  };
}

export default useTilePositions;
