import { FC, useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useTheme } from "styled-components";
import debounce from "lodash.debounce";
import Button, { Popup } from "semantic-ui-react";
import { Link, LinkIcon, Trash2 } from "lucide-react";
import { useCalendar } from "@/context/CalendarProvider";
import { getDatesRange } from "@/utils/getDatesRange";
import { getTileProperties } from "@/utils/getTileProperties";
import { getTileTextColor } from "@/utils/getTileTextColor";
import { Day, SchedulerProjectData, TooltipData, ZoomLevel } from "@/types/global";
import { getTooltipData } from "@/utils/getTooltipData";
import { usePagination } from "@/hooks/usePagination";
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

const initialTooltipData: TooltipData = {
  coords: { x: 0, y: 0 },
  resourceIndex: 0,
  disposition: {
    taken: { hours: 0, minutes: 0 },
    free: { hours: 0, minutes: 0 },
    overtime: { hours: 0, minutes: 0 }
  }
};

const Tile: FC<TileProps> = ({
  row,
  data,
  renderData,
  reportPosition,
  projectData,
  truncateText,
  tasks,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  subDispatch,
  subEntryActions,
  form
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
          coords: { x, y },
          resourceIndex,
          disposition
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

  const handleTileHover = (data: SchedulerProjectData) => {
    setHoveredTileData(data);
  };

  const handleMouseLeave = useCallback(() => {
    debouncedHandleMouseOver.current.cancel();
    setIsVisible(false);
  }, []);

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
  }, [zoom, row, data]);

  const [isHidden, setIsHidden] = useState(false);
  const endDate = new Date(data.dueDate);
  const now = new Date();
  const isPast = endDate < now;
  const effectiveIsHidden = isPast ? true : isHidden;

  return (
    <div onMouseEnter={() => setPopupOpen(true)} onMouseLeave={() => setPopupOpen(false)}>
      <Popup
        open={popupOpen}
        size="mini"
        position="top left"
        on="hover" // optional: removes focus/click toggle behavior
        content={() => {
          return (
            <div
              className=""
              style={{ color: "white", display: "flex", flexDirection: "row", width: "10px" }}>
              {parentChildTask?.({
                task: data,
                selectedParentTask: selectedParentTasks,
                form: undefined,
                subDispatch: subDispatch,
                subEntryActions: subEntryActions
              })}

              {alarmClock?.({
                form: form,
                task: data,
                setAddTaskMonth: setAddTaskMonth,
                setAddTaskDate: setAddTaskDate,
                isRecurringSelected: false,
                taskDueDate: data.dueDate,
                setSelectedTask: setSelectedTask,
                subDispatch: subDispatch,
                subEntryActions: subEntryActions,
                addTaskMonth: undefined,
                addTaskDate: null
              })}

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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
