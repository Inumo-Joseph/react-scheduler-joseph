/**
 * Enhanced dependency arrow drawing with smooth curves and directional arrowheads.
 */

import { tileHeight } from "@/constants";

export interface ArrowStyle {
  /** Line color */
  strokeColor: string;
  /** Line width (base, scales with zoom) */
  lineWidth: number;
  /** Arrowhead size (base, scales with zoom) */
  arrowSize: number;
  /** Enable shadow/glow effect */
  shadow: boolean;
  /** Shadow color */
  shadowColor: string;
  /** Shadow blur radius */
  shadowBlur: number;
}

const defaultStyle: ArrowStyle = {
  strokeColor: "#6B7280",
  lineWidth: 1.5,
  arrowSize: 7,
  shadow: true,
  shadowColor: "rgba(0, 0, 0, 0.08)",
  shadowBlur: 2
};

// Zoom-based scale factors for arrow sizing
const zoomScaleFactors: Record<number, number> = {
  0: 1.0,   // Week view
  1: 1.2,   // Day view
  2: 1.4,   // Hour view
  3: 0.8    // Month view (smaller to not overwhelm)
};

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  from: { x: number; y: number; width: number; height: number; _index: number },
  to: { x: number; y: number; width: number; height: number; _index: number },
  customStyle: Partial<ArrowStyle> = {}
) {
  const style = { ...defaultStyle, ...customStyle };
  const scale = zoomScaleFactors[zoom] ?? 1.0;

  // Scale dimensions based on zoom
  const lineWidth = style.lineWidth * scale;
  const arrowSize = style.arrowSize * scale;

  // Calculate start point (right edge of child tile, vertically centered)
  const startX = from.x + from.width;
  const startY = from.y + tileHeight / 1.5;

  // Calculate end point (vertically centered on parent tile)
  const endY = to.y + tileHeight / 2;

  // Determine which edge of parent tile to connect to
  const parentLeftEdge = to.x;
  const parentRightEdge = to.x + to.width;

  // Connect to whichever edge is closer
  const distToLeft = Math.abs(startX - parentLeftEdge);
  const distToRight = Math.abs(startX - parentRightEdge);

  let endX: number;
  let arrowPointsLeft: boolean;

  if (distToRight < distToLeft) {
    // Connect to right edge - arrow points left (into the tile)
    endX = parentRightEdge;
    arrowPointsLeft = true;
  } else {
    // Connect to left edge - arrow points right (into the tile)
    endX = parentLeftEdge;
    arrowPointsLeft = false;
  }

  // Save context state
  ctx.save();

  // Apply shadow if enabled
  if (style.shadow) {
    ctx.shadowColor = style.shadowColor;
    ctx.shadowBlur = style.shadowBlur;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }

  // Set line style
  ctx.strokeStyle = style.strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw the path with sharp 90-degree corners
  ctx.beginPath();
  const { lastSegmentAngle } = draw90DegreePath(ctx, startX, startY, endX, endY, arrowPointsLeft);
  ctx.stroke();

  // Draw arrowhead pointing in the direction of the last segment
  ctx.shadowColor = "transparent";
  drawArrowhead(ctx, endX, endY, arrowSize, style.strokeColor, lastSegmentAngle);

  // Draw start dot
  drawStartDot(ctx, startX, startY, lineWidth, style.strokeColor);

  // Restore context state
  ctx.restore();
}

/**
 * Draw a 90-degree elbow path with sharp corners.
 * Goes horizontal first, then vertical to the endpoint.
 * Returns the angle of the last segment for arrowhead orientation.
 */
function draw90DegreePath(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  arrowPointsLeft: boolean
): { lastSegmentAngle: number } {
  ctx.moveTo(startX, startY);

  // If start and end are at the same Y, just draw a horizontal line
  if (Math.abs(startY - endY) < 2) {
    ctx.lineTo(endX, endY);
    // Arrow points in direction of horizontal travel
    return { lastSegmentAngle: endX > startX ? 0 : Math.PI };
  }

  // Draw L-shaped path: horizontal first, then vertical
  // The corner is at (endX, startY)
  ctx.lineTo(endX, startY);  // Horizontal segment
  ctx.lineTo(endX, endY);    // Vertical segment

  // The final segment is vertical, so arrow points up or down
  // But we want it to point INTO the tile (horizontally)
  // So use the horizontal direction based on which edge we're connecting to
  const lastSegmentAngle = arrowPointsLeft ? Math.PI : 0;

  return { lastSegmentAngle };
}

/**
 * Draw a filled arrowhead pointing in the specified direction.
 */
function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  size: number,
  color: string,
  angle: number
) {
  const headLength = size;
  const headWidth = size * 0.6;

  ctx.beginPath();

  // Arrow tip
  ctx.moveTo(tipX, tipY);

  // Calculate the two back points of the arrowhead
  // They're perpendicular to the arrow direction
  const backX = tipX - headLength * Math.cos(angle);
  const backY = tipY - headLength * Math.sin(angle);

  // Perpendicular offset for the width
  const perpX = headWidth * Math.sin(angle);
  const perpY = -headWidth * Math.cos(angle);

  // Left wing
  ctx.lineTo(backX + perpX, backY + perpY);

  // Back center notch (creates a pointed arrow shape)
  const notchDepth = headLength * 0.3;
  ctx.lineTo(
    tipX - (headLength - notchDepth) * Math.cos(angle),
    tipY - (headLength - notchDepth) * Math.sin(angle)
  );

  // Right wing
  ctx.lineTo(backX - perpX, backY - perpY);

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draw a small dot at the start of the arrow.
 */
function drawStartDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lineWidth: number,
  color: string
) {
  const radius = lineWidth * 1.2;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draw a highlighted arrow (for hover/selection states).
 */
export function drawHighlightedArrow(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  from: { x: number; y: number; width: number; height: number; _index: number },
  to: { x: number; y: number; width: number; height: number; _index: number }
) {
  drawArrow(ctx, zoom, from, to, {
    strokeColor: "#6E7FF5",
    lineWidth: 2.5,
    arrowSize: 9,
    shadow: true,
    shadowColor: "rgba(110, 127, 245, 0.25)",
    shadowBlur: 4
  });
}

/**
 * Draw an error/invalid arrow (for showing invalid dependencies).
 */
export function drawErrorArrow(
  ctx: CanvasRenderingContext2D,
  zoom: number,
  from: { x: number; y: number; width: number; height: number; _index: number },
  to: { x: number; y: number; width: number; height: number; _index: number }
) {
  drawArrow(ctx, zoom, from, to, {
    strokeColor: "#E5484D",
    lineWidth: 2,
    arrowSize: 8,
    shadow: true,
    shadowColor: "rgba(229, 72, 77, 0.2)",
    shadowBlur: 3
  });
}
