import { SchedulerProjectData } from "@/types/global";
import { drawArrow } from "./drawArrows";

type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;

/**
 * Draw dependency arrows between tasks using Canvas
 */
export function drawDependencyArrows(
  ctx: CanvasRenderingContext2D,
  data: SchedulerProjectData[],
  tilePositions: TilePositionMap,
  zoom: number
) {
  data.forEach((task) => {
    const to = tilePositions[task.dependency ?? ""];
    const from = tilePositions[task.id];
    if (!from || !to) return;
    const index = data.indexOf(task);
    drawArrow(
      ctx,
      zoom,
      { x: from.x, y: from.y, width: from.width, height: from.height, _index: index },
      { x: to.x, y: to.y, width: to.width, height: to.height, _index: index }
    );
  });
}
