import { FC, useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useTheme } from "styled-components";
import debounce from "lodash.debounce";
import Button, { Popup } from "semantic-ui-react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CombineIcon } from "lucide-react";
import { useCalendar } from "@/context/CalendarProvider";
import { getDatesRange } from "@/utils/getDatesRange";
import { getTileProperties } from "@/utils/getTileProperties";
import { getTileTextColor } from "@/utils/getTileTextColor";
import { Day, SchedulerProjectData, TooltipData, ZoomLevel } from "@/types/global";
import { getTooltipData } from "@/utils/getTooltipData";
import { usePagination } from "@/hooks/usePagination";
import { headerHeight } from "@/constants";
import { getStatus } from "@/utils/getStatus";
import { TileProps } from "./types";
import {
  StyledDescription,
  StyledStickyWrapper,
  StyledText,
  StyledTextWrapper,
  StyledTileWrapper
} from "./styles";
import "semantic-ui-css/semantic.min.css";

const Tile: FC<TileProps> = ({
  row,
  data,
  renderData,
  reportPosition,
  tilePositions,
  handleDragEnd,
  projectData,
  truncateText,
  parentChildTask,
  alarmClock,
  Users,
  onAssignTask,
  form,
  reccuringIcon,
  onTileHover,
  canvasRef
}) => {
  const { date } = useCalendar();
  let tileRef = useRef<HTMLDivElement>(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>({});
  const [tileNode, setTileNode] = useState<HTMLDivElement | null>(null);
  const {
    zoom,
    startDate,
    config: { includeTakenHoursOnWeekendsInDayView, showTooltip, showThemeToggle }
  } = useCalendar();

  const datesRange = getDatesRange(date, zoom);
  const { y, x, width } = getTileProperties(
    row,
    datesRange.startDate,
    datesRange.endDate,
    data.startDate,
    data.dueDate,
    zoom
  );

  const [hoveredTileData, setHoveredTileData] = useState<SchedulerProjectData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [addTaskMonth, setAddTaskMonth] = useState<Date | undefined>(new Date());
  const [isHidden, setIsHidden] = useState(false);

  const endDate = new Date(data.dueDate);
  const now = new Date();
  const isPast = endDate < now;
  let effectiveIsHidden = false;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${data.id}`,
    data: data
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `${data.id}`,
    data: data
  });

  const combinedRef = useCallback(
    (node: any) => {
      // Set all three refs to the same DOM node
      setTileNode(node); // This replaces tileRef.current
      tileRef = node; // Add this line
      setNodeRef(node);
      setDroppableRef(node);
    },
    [setNodeRef, setDroppableRef]
  );

  const setHoursToDate = (date: string | number | Date, hours: any) => {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const [addTaskDate, setAddTaskDate] = useState<Date | undefined>(() =>
    setHoursToDate(new Date(), 17)
  );

  const selectedParentTasks = null;

  const {
    page,
    projectsPerPerson,
    totalRowsPerPage,
    rowsPerItem,
    currentPageNum,
    pagesAmount,
    next,
    previous,
    reset
  } = usePagination(projectData);

  const debouncedHandleMouseOver = useRef(
    debounce(
      (
        e: MouseEvent,
        startDate: Day,
        rowsPerItem: number[],
        projectsPerPerson: SchedulerProjectData[][][],
        zoom: ZoomLevel
      ) => {
        if (!tileNode) return;
        const { left, top } = tileNode.getBoundingClientRect();
        const tooltipCoords = { x: e.clientX - left, y: e.clientY - top };
        const {
          coords: { x, y }
        } = getTooltipData(
          startDate,
          tooltipCoords,
          rowsPerItem,
          projectsPerPerson,
          zoom,
          includeTakenHoursOnWeekendsInDayView
        );
        setIsVisible(true);
      },
      300
    )
  );

  const handleTileHover = (data: SchedulerProjectData) => {};

  const handleMouseLeave = useCallback(() => {
    debouncedHandleMouseOver.current.cancel();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (selectedTask) {
      form.reset({
        from: "",
        name: selectedTask?.name || "",
        userId: selectedTask?.userId || "",
        dueDate: selectedTask?.dueDate ? new Date(selectedTask.dueDate) : addTaskDate,
        time: selectedTask?.dueTime || 17,
        recurring: selectedTask?.recurring || null,
        reminder: selectedTask?.reminder || "None",
        isRecurring: selectedTask?.isRecurring || false
      });
    }
  }, [form, selectedTask]);

  useEffect(() => {
    handleTileHover(data);

    const handleMouseOver = (e: MouseEvent) =>
      debouncedHandleMouseOver.current(e, startDate, rowsPerItem, projectsPerPerson, zoom);
    const gridArea = tileNode;

    if (!gridArea) return;
    gridArea.addEventListener("mousemove", handleMouseOver);
    gridArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridArea.removeEventListener("mousemove", handleMouseOver);
      gridArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [debouncedHandleMouseOver, handleMouseLeave, projectsPerPerson, rowsPerItem, startDate, zoom]);

  useLayoutEffect(() => {
    if (tileNode) {
      const tileRect = tileNode.getBoundingClientRect();

      const canvas = document.querySelector("canvas");
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();

      reportPosition?.(data.id, {
        x: tileRect.left - canvasRect.left,
        y: tileRect.top - canvasRect.top + headerHeight + 15,
        width: tileRect.width,
        height: tileRect.height
      });
    }
  }, [zoom, row, data, onAssignTask, isPast]);

  if (isPast) {
    effectiveIsHidden = true;
  } else {
    effectiveIsHidden = data.isCompleted ? true : isHidden;
  }

  const isSelectedFrom = form.watch("from");
  const isRecurringSelected = form.watch("isRecurring");

  return (
    <div
      onMouseEnter={() => {
        setPopupOpen(true);
        handleTileHover;
      }}
      onMouseLeave={() => setPopupOpen(false)}>
      <Popup
        open={popupOpen}
        size="mini"
        position="top left"
        on="hover" // optional: removes focus/click toggle behavior
        content={() => {
          return (
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center", // vertical alignment
                justifyContent: "center", // horizontal centering
                gap: "5px", // spacing between items
                color: "white"
              }}>
              <button
                style={{
                  background: data.isCompleted ? "#e04658" : "#038759",
                  border: "2px solid white",
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  padding: "3px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontSize: "0.6rem"
                }}
                onClick={() => {
                  setIsHidden((prev) => {
                    const newVal = !prev;
                    const updatedTask = {
                      ...data,
                      isCompleted: newVal
                    };
                    onAssignTask?.(data.id, updatedTask);
                    return newVal;
                  });
                }}>
                {data.isCompleted ? "Undo" : "Done"}
              </button>

              <div style={{ color: "black" }}>
                {parentChildTask?.({
                  task: data,
                  selectedParentTask: selectedParentTasks,
                  updateTaskMode: true,
                  form: undefined
                })}
              </div>

              {data.recurring && (
                <div
                  className="relative flex text-[white] w-[40px] h-[21px] px-1 items-center justify-between rounded-[4px]"
                  style={{ backgroundColor: getStatus(data).background }}>
                  {reccuringIcon}
                  <p>{data.recurring?.[0]}</p>
                </div>
              )}

              {alarmClock?.({
                form: form,
                task: data,
                setAddTaskMonth: setAddTaskMonth,
                setAddTaskDate: setAddTaskDate,
                isRecurringSelected: isRecurringSelected,
                taskDueDate: data.dueDate,
                setSelectedTask: setSelectedTask,
                addTaskMonth: addTaskMonth,
                addTaskDate: addTaskDate
              })}

              {Users?.({
                form: form,
                task: data
              })}

              <div style={{ color: "black", display: "flex" }} className=" pt-1 pl-1">
                {renderData}
              </div>
            </div>
          );
        }}
        trigger={
          <StyledTileWrapper
            ref={combinedRef}
            {...attributes}
            {...listeners}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              backgroundColor: `${data.bgColor ?? "#ffcc4d"}`,
              opacity: isDragging ? 0.5 : effectiveIsHidden ? "0.4" : "1", // Add isDragging opacity
              width: `${width}px`,
              color: getTileTextColor(data.bgColor ?? ""),
              transform: transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                : undefined, // Add transform
              border: isOver ? "2px solid blue" : undefined // Add drop indicator
            }}
            onMouseEnter={() => {
              setPopupOpen(true);
              handleTileHover;
            }}>
            <StyledTextWrapper>
              <StyledStickyWrapper $allowOverflow={truncateText}>
                <>
                  {/* UsersIcon and Title on the same line */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {Users?.({
                      form: form,
                      task: data
                    })}

                    <div
                      style={{
                        color: "black",
                        ...(!truncateText && {
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        })
                      }}>
                      {data.name}
                    </div>
                  </div>
                  {/* Subtitle and description below */}
                  <StyledText>{data.subtitle}</StyledText>
                  <StyledDescription $allowOverflow={truncateText}>
                    {data.description}
                  </StyledDescription>
                </>
              </StyledStickyWrapper>
            </StyledTextWrapper>
          </StyledTileWrapper>
        } // <-- Required!
      />
    </div>
  );
};

export default Tile;
