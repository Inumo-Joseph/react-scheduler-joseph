import React from "react";
import { DrawRowConfig } from "@/types/global";

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  from: { x: number; y: number; width: number; height: number; _index: number },
  to: { x: number; y: number; width: number; height: number; _index: number },
  options = {
    padding: 19,
    arrowCurve: 1,
    barHeight: 5,
    headerHeight: 30
  }
) {
  const curve = options.arrowCurve;
  const padding = options.padding;

  let startX = from.x + from.width;
  const fromBelowTo = from._index > to._index;

  // console.log("Index from", from._index, "Index to", to._index);

  // Adjust startX left if overlapping
  const condition = () => to.x < startX + padding && startX > from.x + padding;
  while (condition()) startX -= 10;
  startX -= 10;

  const startY = from.y - from.height - options.barHeight * 5;
  const endX = to.x;
  const endY = to.y - to.height - options.headerHeight;
  //
  // options.barHeight +
  //
  // padding

  const curveY = fromBelowTo ? -curve : curve;

  ctx.beginPath();
  ctx.moveTo(startX, startY);

  // Case: overlapping bars, make elbow path with arcs
  if (to.x <= from.x + padding) {
    let down1 = padding / 2 - curve;
    let effectiveCurve = curve;
    if (down1 < 0) {
      down1 = 0;
      effectiveCurve = padding / 2;
    }

    const down2 = endY;
    const left = to.x - padding;

    // v down1
    ctx.lineTo(startX, startY + down1);
    // arc to left
    ctx.arcTo(
      startX,
      startY + down1 + effectiveCurve,
      startX - effectiveCurve,
      startY + down1 + effectiveCurve,
      effectiveCurve
    );
    // horizontal to left
    ctx.lineTo(left, startY + down1 + effectiveCurve);
    // arc down or up
    ctx.arcTo(
      left - effectiveCurve,
      startY + down1 + effectiveCurve,
      left - effectiveCurve,
      down2,
      effectiveCurve
    );
    // vertical down
    ctx.lineTo(left - effectiveCurve, down2);
    // arc right
    ctx.arcTo(left - effectiveCurve, down2, endX, endY, effectiveCurve);
    // final segment to arrowhead point
    ctx.lineTo(endX, endY);
  } else {
    // Simple vertical offset and curve for non-overlapping tasks
    let effectiveCurve = curve;
    if (endX < startX + curve) effectiveCurve = endX - startX;
    const offset = endY + effectiveCurve;

    ctx.lineTo(startX, offset);
    ctx.arcTo(startX, offset, startX + effectiveCurve, offset, effectiveCurve);
    ctx.lineTo(endX, endY);
  }

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw arrowhead
  const headlen = 8;
  const angle = Math.atan2(endY - startY, endX);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle - Math.PI / 6),
    endY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - headlen * Math.cos(angle + Math.PI / 6),
    endY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
}

// export function drawArrow(
//     ctx: CanvasRenderingContext2D,
//     zoom: number,
//     from: { x: number; y: number; width: number; height: number},
//     to: { x: number; y: number; width: number; height: number }
//   ) {
//     const offset = 30; // horizontal spacing for bends
//     let fromX = from.x + from.width;
//     let fromY = from.y + from.height / 2  ;

//     // End: middle of the left edge of the parent task
//     let toX = to.x-50;
//     let toY = to.y -3;

//     if(zoom == 1)
//     {
//         fromX = from.x-60
//         toX = to.x-50
//     }

//     // Draw bent (elbow) arrow path
//     ctx.beginPath();
//     ctx.moveTo(fromX, fromY);
//     ctx.lineTo(fromX + offset, fromY); // horizontal
//     ctx.lineTo(fromX + offset, toY);   // vertical
//     ctx.lineTo(toX, toY);              // final horizontal to parent
//     ctx.strokeStyle = "grey";
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Arrowhead at parent side
//     const headlen = 5;
//     const angle = Math.atan2(toY-80 - (fromY), toX - (fromX + offset));
//     ctx.beginPath();
//     ctx.moveTo(toX, toY);
//     ctx.lineTo(
//       toX - headlen * Math.cos(angle - Math.PI / 6),
//       toY - headlen * Math.sin(angle - Math.PI / 6)
//     );
//     ctx.lineTo(
//       toX - headlen * Math.cos(angle + Math.PI / 6),
//       toY - headlen * Math.sin(angle + Math.PI / 6)
//     );
//     ctx.closePath();
//     ctx.fillStyle = "grey";
//     ctx.fill();
//   }
