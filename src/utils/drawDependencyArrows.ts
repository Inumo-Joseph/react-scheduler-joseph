import { useEffect } from "react";
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
  zoom: number,
  scale?: number,
  showHideChecked?: boolean,
  SchedulerRef?: React.RefObject<HTMLDivElement>
) {
  data.forEach((task) => {
    const to = tilePositions[task.parentTaskId ?? ""];
    const from = tilePositions[task.id];
    if (!from || !to) return;

    const index = data.indexOf(task);
    const index2 = data.findIndex((currentTask) => currentTask.id === task.parentTaskId);

    if (showHideChecked) {
      if (index2 === -1) return;
    }

    const fromx = (scale ?? 1) * from.x;
    const fromy = (scale ?? 1) * from.y;
    const fromWidth = (scale ?? 1) * from.width;
    const fromheight = (scale ?? 1) * from.height;

    const tox = (scale ?? 1) * to.x;
    const toy = (scale ?? 1) * to.y;
    const toWidth = (scale ?? 1) * to.width;
    const toHeight = (scale ?? 1) * to.height;

    drawArrow(
      ctx,
      zoom,
      { x: fromx, y: fromy, width: fromWidth, height: fromheight, _index: index },
      { x: tox, y: toy, width: toWidth, height: toHeight, _index: index2 }
    );
  });
}
