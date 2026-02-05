import { SchedulerProjectData } from "@/types/global";
import { drawArrow } from "./drawArrows";

type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;

/**
 * Draw dependency arrows between tasks using Canvas.
 * Only draws arrows for tasks that have valid positions (are currently visible).
 * Tile positions are already canvas-relative and updated on scroll.
 */
export function drawDependencyArrows(
  ctx: CanvasRenderingContext2D,
  data: SchedulerProjectData[],
  tilePositions: TilePositionMap,
  zoom: number,
  hideCheckedItems?: boolean
) {

  // Create a map for quick lookup of task indices in the visible data
  const visibleTaskIndices = new Map<string, number>();
  data.forEach((task, index) => {
    visibleTaskIndices.set(task.id, index);
  });

  // Create a set of visible task IDs for quick lookup
  const visibleTaskIds = new Set(data.map((task) => task.id));

  data.forEach((task) => {
    // Skip if task has no parent dependency
    if (!task.parentTaskId) return;

    // Get positions for both tasks
    const fromPosition = tilePositions[task.id];
    const toPosition = tilePositions[task.parentTaskId];

    // Skip if positions are not available
    if (!fromPosition || !toPosition) return;

    // Get the visual indices of both tasks in the current visible data
    const fromIndex = visibleTaskIndices.get(task.id);
    const toIndex = visibleTaskIndices.get(task.parentTaskId);

    // Skip if either index is undefined (task not in visible data)
    if (fromIndex === undefined || toIndex === undefined) return;

    // When hiding checked items, verify parent task is actually visible
    if (hideCheckedItems && !visibleTaskIds.has(task.parentTaskId)) {
      return;
    }

    // Prepare coordinates (tile positions are already canvas-relative and updated on scroll)
    const from = {
      x: fromPosition.x,
      y: fromPosition.y,
      width: fromPosition.width,
      height: fromPosition.height,
      _index: fromIndex
    };

    const to = {
      x: toPosition.x,
      y: toPosition.y,
      width: toPosition.width,
      height: toPosition.height,
      _index: toIndex
    };

    // Draw the dependency arrow
    drawArrow(ctx, zoom, from, to);
  });
}
