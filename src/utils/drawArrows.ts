import React from "react";
import { DrawRowConfig } from "@/types/global";

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  from: { x: number; y: number; width: number; height: number; _index: number },
  to: { x: number; y: number; width: number; height: number; _index: number },
  options = {
    padding: 9,
    arrowCurve: 1,
    barHeight: 7,
    headerHeight: 30
  }
) {
  const curve = options.arrowCurve;
  const padding = options.padding;
  let startX = from.x + from.width;
  const svg = document.getElementById("svg-arrows");

  // Adjust startX left if overlapping
  const condition = () => to.x < startX + padding && startX > from.x + padding;
  while (condition()) startX -= 10;
  startX -= 2;

  const startY = from.y - from.height - options.barHeight * 7;
  const endX = to.x;
  const endY = to.y - to.height - options.headerHeight;

  ctx.beginPath();

  ctx.arc(startX, startY + 3.5, 1.5, -90, Math.PI, false);
  ctx.fill();
  ctx.moveTo(startX, startY);

  // Case: overlapping bars, make elbow path with arcs
  if (to.x <= from.x + padding) {
    let down1 = padding / 2 - curve;
    let effectiveCurve = curve;
    if (down1 < 0) {
      down1 = 0;
      effectiveCurve = padding;
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
  ctx.moveTo(endX + 3, endY);
  ctx.lineTo(endX - headlen * Math.cos(-Math.PI / 6), endY - headlen * Math.sin(-Math.PI / 6));
  ctx.lineTo(endX - headlen * Math.cos(+Math.PI / 6), endY - headlen * Math.sin(+Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
}
