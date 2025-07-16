import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import dayjs from "dayjs";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
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
    parentChildTask,
    alarmClock,
    Users,
    onTileHover,
    hideCheckedItems,
    setShowCompleted,
    onAssignTask,
    form,
    calendarScale,
    SchedulerRef,
    reccuringIcon
  },
  ref
) {
  const {
    handleScrollNext,
    handleScrollPrev,
    date,
    isLoading,
    cols,
    startDate,
    updateTilesCoords
  } = useCalendar();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refRight = useRef<HTMLSpanElement>(null);
  const refLeft = useRef<HTMLSpanElement>(null);

  const theme = useTheme();
  type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;
  const [tilePositions, setTilePositions] = useState<TilePositionMap>({});
  const allProjects: SchedulerProjectData[] = data.flatMap((row) =>
    row.data.flatMap((projectsPerRow) => projectsPerRow)
  );

  const handleTilePosition = (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => {
    setTilePositions((prev) => ({
      ...prev,
      [id]: pos
    }));
  };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   console.log("DRAGGABEL EVENT TI")
  //   const {active, over} = event;
  //   if (active && over && active.id !== over.id) {
  //     const draggedTask = allProjects.find(task=> task.id===active.id)
  //     const targetTask = allProjects.find(task=> task.id===over.id)

  //     console.log("Dragged", draggedTask, "target", targetTask)

  //     // check dates etc.
  //     if (draggedTask && targetTask && draggedTask.startDate > targetTask.startDate) {
  //       // update parentTaskId etc.
  //       onAssignTask?.(draggedTask.id, {
  //         ...draggedTask,
  //         parentTaskId: targetTask.id
  //       });
  //     }
  //   }
  // };

  const handleResize = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const width = getCanvasWidth();
      const height = rows * boxHeight + 1;
      resizeCanvas(ctx, width, height);
      drawGrid(ctx, zoom, rows, cols, startDate, theme);
    },
    [cols, startDate, rows, zoom, theme, truncateText]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const onResize = () => handleResize(ctx);

    window.addEventListener("resize", onResize);
    // drawDependencyArrows(
    //   ctx,
    //   data.flatMap((paginatedRow) => {
    //     return paginatedRow.data.flatMap((doubleArray) => {
    //       return doubleArray;
    //     });
    //   }),
    //   tilePositions,
    //   zoom
    // );

    return () => window.removeEventListener("resize", onResize);
  }, [handleResize]);

  useEffect(() => {
    const schedulerContainer = SchedulerRef?.current;
    if (!schedulerContainer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.letterSpacing = "1px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scrollOffset = {
      scrollTop: SchedulerRef?.current?.scrollTop || 0,
      scrollLeft: SchedulerRef?.current?.scrollLeft || 0
    };

    const handleScroll = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleResize(ctx); // draw grid first

      drawDependencyArrows(
        ctx,
        allProjects,
        tilePositions,
        zoom,
        calendarScale,
        hideCheckedItems,
        scrollOffset
      );
    };
    schedulerContainer.addEventListener("scroll", handleScroll);
    return () => schedulerContainer.removeEventListener("scroll", handleScroll);
  }, [date, rows, zoom, handleResize, tilePositions, truncateText, hideCheckedItems]);

  //   useEffect(() => {
  //   const schedulerContainer = SchedulerRef?.current;
  //   if (!schedulerContainer) return;

  //   const handleScroll = () => {
  //     const canvas = canvasRef.current;
  //     if (!canvas) return;
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     handleResize(ctx);

  //     const scrollOffset = schedulerContainer.scrollTop;
  //     drawDependencyArrows(
  //       ctx,
  //       allProjects,
  //       tilePositions,
  //       zoom,
  //       calendarScale,
  //       hideCheckedItems,
  //       scrollOffset
  //     );
  //   };

  //   schedulerContainer.addEventListener('scroll', handleScroll);
  //   return () => schedulerContainer.removeEventListener('scroll', handleScroll);
  // }, [allProjects, tilePositions, zoom, calendarScale, hideCheckedItems, handleResize]);

  useEffect(() => {
    if (!refRight.current) return;
    const observerRight = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollNext() : null),
      { root: document.getElementById(outsideWrapperId) }
    );
    const canvas = canvasRef.current;

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

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DRAGGABEL EVENT TRIGGERED");
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const draggedTask = allProjects.find((task) => task.id === active.id);
      const targetTask = allProjects.find((task) => task.id === over.id);

      // check dates etc.
      const flag = draggedTask?.cardId === targetTask?.cardId;
      if (draggedTask && targetTask && flag && draggedTask.dueDate < targetTask.dueDate) {
        // update parentTaskId etc.
        onAssignTask?.(draggedTask.id, {
          ...draggedTask,
          parentTaskId: targetTask.id
        });
      }
    }
  };

  return (
    <StyledWrapper id={canvasWrapperId}>
      <StyledInnerWrapper ref={ref}>
        <StyledSpan position="left" ref={refLeft} />
        <Loader isLoading={isLoading} position="left" />

        <DndContext onDragEnd={handleDragEnd}>
          <Tiles
            data={data}
            tilePositions={tilePositions}
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
            onTileHover={onTileHover}
            showCompleted={hideCheckedItems}
            setShowCompleted={setShowCompleted}
            onAssignTask={onAssignTask}
            form={form}
            reccuringIcon={reccuringIcon}
            handleDragEnd={handleDragEnd}
            canvasRef={canvasRef}
          />
        </DndContext>
        <StyledCanvas ref={canvasRef} />

        <StyledSpan ref={refRight} position="right" />
        <Loader isLoading={isLoading} position="right" />
      </StyledInnerWrapper>
    </StyledWrapper>
  );
});

export default Grid;
