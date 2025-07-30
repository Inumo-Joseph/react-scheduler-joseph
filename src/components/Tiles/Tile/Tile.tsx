import {
  FC,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  memo,
  useMemo
} from "react";
import debounce from "lodash.debounce";
import Button, { Popup } from "semantic-ui-react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
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

const Tile: FC<TileProps> = memo(
  ({
    row,
    data,
    renderData,
    reportPosition,
    truncateText,
    parentChildTask,
    alarmClock,
    Users,
    onAssignTask,
    form,
    reccuringIcon,
    setClickedTask
  }) => {
    const { date } = useCalendar();
    let tileRef = useRef<HTMLDivElement>(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [tileNode, setTileNode] = useState<HTMLDivElement | null>(null);
    const {
      zoom,
      startDate,
      config: { includeTakenHoursOnWeekendsInDayView, showTooltip, showThemeToggle }
    } = useCalendar();

    // Memoize expensive calculations
    const datesRange = getDatesRange(date, zoom);
    const tileProperties = getTileProperties(
      row,
      datesRange.startDate,
      datesRange.endDate,
      data.startDate,
      data.dueDate,
      zoom
    );
    const { y, x, width } = tileProperties;

    const [hoveredTileData, setHoveredTileData] = useState<SchedulerProjectData | null>(null);
    const [addTaskMonth, setAddTaskMonth] = useState<Date | undefined>(new Date());
    const [isHidden, setIsHidden] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any | null>();

    // Memoize date calculations
    const { endDate, isPast, effectiveIsHidden } = useMemo(() => {
      const endDate = new Date(data.dueDate);
      const now = new Date();
      const isPast = endDate < now;
      const effectiveIsHidden = isPast ? true : data.isCompleted ? true : isHidden;

      return { endDate, isPast, effectiveIsHidden };
    }, [data.dueDate, data.isCompleted, isHidden]);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `${data.id}`,
      data: data
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
      id: `${data.id}`,
      data: data
    });

    const isSelectedFrom = form.watch("from");
    const isRecurringSelected = form.watch("isRecurring");

    // Memoize the combined ref callback
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

    // Memoize utility functions
    const setHoursToDate = useCallback((date: string | number | Date, hours: any) => {
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate;
    }, []);

    const [addTaskDate, setAddTaskDate] = useState<Date | undefined>(() =>
      setHoursToDate(new Date(), 17)
    );

    const selectedParentTasks = null;

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

    const debouncedHandleMouseOver = useMemo(
      () =>
        debounce((e: MouseEvent) => {
          if (!tileNode) return;
          const { left, top } = tileNode.getBoundingClientRect();
        }, 300),
      [tileNode, includeTakenHoursOnWeekendsInDayView]
    );

    const handleMouseEnter = useCallback(() => {
      setPopupOpen(true);
    }, [popupOpen]);

    const handleMouseLeavePopup = useCallback(() => {
      setPopupOpen(false);
    }, [popupOpen]);

    const handleMouseLeave = useCallback(() => {
      debouncedHandleMouseOver.cancel();
    }, [debouncedHandleMouseOver]);

    // Optimize event listeners with proper dependencies
    useEffect(() => {
      if (isDragging || isOver) return;

      const handleMouseOver = (e: MouseEvent) => debouncedHandleMouseOver(e);

      const gridArea = tileNode;
      if (!gridArea) return;

      gridArea.addEventListener("mousemove", handleMouseOver);
      gridArea.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        gridArea.removeEventListener("mousemove", handleMouseOver);
        gridArea.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [tileNode, debouncedHandleMouseOver, startDate, isDragging]);

    useLayoutEffect(() => {
      if (isDragging || isOver) return;

      if (tileNode && reportPosition) {
        const tileRect = tileNode.getBoundingClientRect();
        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();

        reportPosition(data.id, {
          x: tileRect.left - canvasRect.left,
          y: tileRect.top - canvasRect.top + headerHeight + 15,
          width: tileRect.width,
          height: tileRect.height
        });
        console.log("------Position for Tile-------", data);
        console.log(
          "Reporting position x: ",
          tileRect.left - canvasRect.left,
          "y:",
          tileRect.top - canvasRect.top + headerHeight + 15
        );
      }
    }, [zoom, tileProperties, data.id, reportPosition, tileNode, isPast]);

    const actualTruncate = useMemo(() => {
      if (isDragging || isOver) return;

      if (
        truncateText &&
        data.isRecurring &&
        data.recurring === "Daily" &&
        data.id.includes("-recurring")
      ) {
        return true;
      }

      return truncateText;
    }, [zoom, truncateText, data.isRecurring, data.recurring, data.id]);

    // Memoize task completion handler
    const handleTaskToggle = useCallback(() => {
      if (isDragging || isOver) return;

      setIsHidden((prev) => {
        const newVal = !prev;
        const updatedTask = {
          ...data,
          isCompleted: newVal
        };
        onAssignTask?.(data.id, updatedTask, null);
        return newVal;
      });
    }, [data, onAssignTask]);

    // Memoize click handler
    const handleTaskClick = useCallback(() => {
      setClickedTask?.(data);
    }, [setClickedTask, data]);

    // Memoize style objects to prevent recreation
    const tileStyle = useMemo(
      () => ({
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: `${data.bgColor ?? "#ffcc4d"}`,
        opacity: isDragging ? 0.5 : effectiveIsHidden ? "0.4" : "1",
        width: `${width}px`,
        color: getTileTextColor(data.bgColor ?? ""),
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        border: isOver ? "2px solid blue" : undefined
      }),
      [x, y, actualTruncate, data.bgColor, isDragging, effectiveIsHidden, width, transform, isOver]
    );

    // Memoize popup content to prevent recreation

    const popupContent = useMemo(
      () => (
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
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
            onClick={handleTaskToggle}>
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
              <p>{data.recurring?.[0].toUpperCase()}</p>
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
        </div>
      ),
      [
        data.isCompleted,
        data.recurring,
        data.name,
        handleTaskToggle,
        selectedParentTasks,
        form,
        renderData
      ]
    );

    return (
      <>
        <div
          style={{ pointerEvents: (isDragging && transform) || isOver ? "none" : "auto" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeavePopup}>
          <Popup
            open={popupOpen}
            size="mini"
            position="top left"
            on="hover" // optional: removes focus/click toggle behavior
            content={
              <div>
                {popupContent}
                <div
                  style={{ color: "black", display: "flex" }}
                  className=" pt-1 pl-1"
                  onClick={handleTaskClick}>
                  {renderData}
                </div>
              </div>
            }
            trigger={
              <StyledTileWrapper ref={combinedRef} {...attributes} {...listeners} style={tileStyle}>
                <StyledTextWrapper>
                  <StyledStickyWrapper $allowOverflow={actualTruncate}>
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
                            ...(!actualTruncate && {
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
                      <StyledDescription $allowOverflow={actualTruncate}>
                        {data.description}
                      </StyledDescription>
                    </>
                  </StyledStickyWrapper>
                </StyledTextWrapper>
              </StyledTileWrapper>
            }
          />
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.name === nextProps.data.name &&
      prevProps.data.startDate === nextProps.data.startDate &&
      prevProps.data.dueDate === nextProps.data.dueDate &&
      prevProps.data.bgColor === nextProps.data.bgColor &&
      prevProps.data.isCompleted === nextProps.data.isCompleted &&
      prevProps.data.isRecurring === nextProps.data.isRecurring &&
      prevProps.data.recurring === nextProps.data.recurring &&
      prevProps.row === nextProps.row &&
      prevProps.truncateText === nextProps.truncateText
    );
  }
);

Tile.displayName = "Tile";

export default Tile;
