import { useEffect } from "react";
import { cornersOfRectangle } from "@dnd-kit/core/dist/utilities/algorithms/helpers";
import { SchedulerProjectData } from "@/types/global";
import { headerHeight } from "@/constants";
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
  showHideChecked?: boolean,
  scrollOffset?: { scrollTop: number; scrollLeft: number }
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

    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    let yoffset = 0;

    if (scrollOffset?.scrollTop || 0 > 0) {
      yoffset = scrollOffset?.scrollTop || 0;
    }

    const fromx = from.x;
    const fromy = from.y + yoffset;
    const fromWidth = from.width;
    const fromheight = from.height;

    const tox = to.x;
    const toy = to.y + yoffset;
    const toWidth = to.width;
    const toHeight = to.height;
    // console.log("________Drawing Deps________ for Task: ", task.name);
    // console.log("Drawing Deps Arrows from.x", from.x, "to.x", to.x);
    drawArrow(
      ctx,
      zoom,
      { x: fromx, y: fromy, width: fromWidth, height: fromheight, _index: index },
      { x: tox, y: toy, width: toWidth, height: toHeight, _index: index2 }
    );
  });
}
