import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { drawGrid } from "@/utils/drawGrid/drawGrid";
import { boxHeight, canvasWrapperId, leftColumnWidth, outsideWrapperId } from "@/constants";
import { Loader, Tiles } from "@/components";
import { useCalendar } from "@/context/CalendarProvider";
import { resizeCanvas } from "@/utils/resizeCanvas";
import { getCanvasWidth } from "@/utils/getCanvasWidth";
import { drawDependencyArrows } from "@/utils/drawDependencyArrows";
import { SchedulerProjectData } from "@/types/global";
import { GridProps } from "./types";
import { StyledCanvas, StyledInnerWrapper, StyledSpan, StyledWrapper } from "./styles";

const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    zoom,
    rows,
    data,
    renderData,
    truncateText,
    projectData,
    showToggle,
    tasks,
    parentChildTask,
    alarmClock,
    Users,
    hideCheckedItems
  },
  ref
) {
  const { handleScrollNext, handleScrollPrev, date, isLoading, cols, startDate } = useCalendar();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refRight = useRef<HTMLSpanElement>(null);
  const refLeft = useRef<HTMLSpanElement>(null);

  const theme = useTheme();
  type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;
  const [tilePositions, setTilePositions] = useState<TilePositionMap>({});

  const handleTilePosition = (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => {
    setTilePositions((prev) => ({
      ...prev,
      [id]: pos
    }));
  };

  const handleResize = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const width = getCanvasWidth();
      const height = rows * boxHeight + 1;
      resizeCanvas(ctx, width, height);
      drawGrid(ctx, zoom, rows, cols, startDate, theme);
    },
    [cols, startDate, rows, zoom, theme]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const onResize = () => handleResize(ctx);

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.letterSpacing = "1px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allProjects: SchedulerProjectData[] = data.flatMap((row) =>
      row.data.flatMap((projectsPerRow) => projectsPerRow)
    );

    handleResize(ctx); // draw grid first
    drawDependencyArrows(ctx, allProjects, tilePositions, zoom);
    // draw arrows over grid
  }, [date, rows, zoom, handleResize, tilePositions]);

  useEffect(() => {
    if (!refRight.current) return;
    const observerRight = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollNext() : null),
      { root: document.getElementById(outsideWrapperId) }
    );
    observerRight.observe(refRight.current);
    return () => observerRight.disconnect();
  }, [handleScrollNext]);

  useEffect(() => {
    if (!refLeft.current) return;
    const observerLeft = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollPrev() : null),
      {
        root: document.getElementById(outsideWrapperId),
        rootMargin: `0px 0px 0px -${leftColumnWidth}px`
      }
    );
    observerLeft.observe(refLeft.current);

    return () => observerLeft.disconnect();
  }, [handleScrollPrev]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(200, 200);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  return (
    <StyledWrapper id={canvasWrapperId}>
      <StyledInnerWrapper ref={ref}>
        <StyledSpan position="left" ref={refLeft} />
        <Loader isLoading={isLoading} position="left" />
        <StyledCanvas ref={canvasRef} />
        <Tiles
          data={data}
          projectData={projectData}
          zoom={zoom}
          renderData={renderData}
          reportPosition={handleTilePosition}
          truncateText={truncateText}
          showToggle={showToggle}
          parentChildTask={parentChildTask}
          alarmClock={alarmClock}
          Users={Users}
          hideCheckedItems={hideCheckedItems}
          tasks={tasks}
        />
        <StyledSpan ref={refRight} position="right" />
        <Loader isLoading={isLoading} position="right" />
      </StyledInnerWrapper>
    </StyledWrapper>
  );
});

export default Grid;
