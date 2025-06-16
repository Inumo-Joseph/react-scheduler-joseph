import { FC, useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useTheme } from "styled-components";
import debounce from "lodash.debounce";
import Button, { Popup } from "semantic-ui-react";
import { Link, LinkIcon, Subscript, Trash2 } from "lucide-react";
import { useCalendar } from "@/context/CalendarProvider";
import { getDatesRange } from "@/utils/getDatesRange";
import { getTileProperties } from "@/utils/getTileProperties";
import { getTileTextColor } from "@/utils/getTileTextColor";
import { Day, SchedulerProjectData, TooltipData, ZoomLevel } from "@/types/global";
import { getTooltipData } from "@/utils/getTooltipData";
import { usePagination } from "@/hooks/usePagination";
import { drawArrow } from "@/utils/drawArrows";
import UsersIcon from "../../../../src/components/UserIcon";
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
  projectData,
  truncateText,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  onAssignTask,
  form,
  tilePositions,
  onTileHover
}) => {
  const { date } = useCalendar();
  const tileRef = useRef<HTMLDivElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>({});

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

  // console.log("From top SUBDISPATCH", subDispatch);
  const [hoveredTileData, setHoveredTileData] = useState<SchedulerProjectData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [addTaskMonth, setAddTaskMonth] = useState<Date | undefined>(new Date());

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
  const ctx = CanvasRenderingContext2D;
  const isRecurringSelected = form.watch("isRecurring");

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
        if (!tileRef?.current) return;
        const { left, top } = tileRef.current.getBoundingClientRect();
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

  // useEffect(() => {
  //   if (selectedTask) {
  //     form.reset({
  //       from: "",
  //       name: selectedTask?.name || "",
  //       userId: selectedTask?.userId || "",
  //       dueDate: selectedTask?.dueDate ? new Date(selectedTask.dueDate) : addTaskDate,
  //       time: selectedTask?.dueTime || 17,
  //       recurring: selectedTask?.recurring || null,
  //       reminder: selectedTask?.reminder || "None",
  //       isRecurring: selectedTask?.isRecurring || false
  //     });
  //   }
  // }, [form, selectedTask]);  '

  useEffect(() => {
    handleTileHover(data);

    const handleMouseOver = (e: MouseEvent) =>
      debouncedHandleMouseOver.current(e, startDate, rowsPerItem, projectsPerPerson, zoom);
    const gridArea = tileRef?.current;
    if (!gridArea) return;
    gridArea.addEventListener("mousemove", handleMouseOver);
    gridArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridArea.removeEventListener("mousemove", handleMouseOver);
      gridArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [debouncedHandleMouseOver, handleMouseLeave, projectsPerPerson, rowsPerItem, startDate, zoom]);

  useLayoutEffect(() => {
    if (tileRef?.current) {
      const tileRect = tileRef.current.getBoundingClientRect();
      const canvas = document.querySelector("canvas");
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();

      reportPosition?.(data.id, {
        x: tileRect.left - canvasRect.left,
        y: tileRect.top - canvasRect.top,
        width: tileRect.width,
        height: tileRect.height
      });
    }
  }, [zoom, row, data, onAssignTask]);

  const [isHidden, setIsHidden] = useState(false);
  const endDate = new Date(data.dueDate);
  const now = new Date();
  const isPast = endDate < now;
  let effectiveIsHidden = false;

  if (isPast) {
    effectiveIsHidden = true;
  } else {
    effectiveIsHidden = data.isCompleted ? true : isHidden;
  }

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
                    data.isCompleted = newVal;
                    onAssignTask?.(data.id, updatedTask);
                    return newVal;
                  });
                }}>
                {data.isCompleted ? "Undo" : "Done"}
              </button>

              {parentChildTask?.({
                task: data,
                selectedParentTask: selectedParentTasks,
                updateTaskMode: true,
                form: undefined
              })}

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

              <UsersIcon users={data?.users} zoom={zoom} />

              <div style={{ color: "black", display: "flex" }} className=" pt-1 pl-1">
                {renderData}
              </div>
            </div>
          );
        }}
        trigger={
          <StyledTileWrapper
            style={{
              left: `${x}px`,
              top: `${y}px`,
              backgroundColor: `${data.bgColor ?? "#ffcc4d"}`,
              opacity: effectiveIsHidden ? "0.4" : "1",
              width: `${width}px`,
              color: getTileTextColor(data.bgColor ?? "")
            }}
            ref={tileRef}>
            <StyledTextWrapper>
              <StyledStickyWrapper>
                <>
                  {/* UsersIcon and Title on the same line */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <UsersIcon users={data.users} zoom={zoom} />

                    <StyledText
                      bold
                      style={{
                        color: "black",
                        ...(!truncateText && {
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        })
                      }}>
                      {data.name}
                    </StyledText>
                  </div>
                  {/* Subtitle and description below */}
                  <StyledText>{data.subtitle}</StyledText>
                  <StyledDescription>{data.description}</StyledDescription>
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
