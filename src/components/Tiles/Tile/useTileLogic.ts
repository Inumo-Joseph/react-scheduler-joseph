import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useCalendar } from "@/context/CalendarProvider";
import { getDatesRange } from "@/utils/getDatesRange";
import { getTileProperties } from "@/utils/getTileProperties";
import { getTileTextColor } from "@/utils/getTileTextColor";
import { SchedulerProjectData } from "@/types/global";
import { tileHeight } from "@/constants";

/** Darken or lighten a hex color by an amount (-ve darkens, +ve lightens) */
function adjustColor(hex: string, amount: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const h = hex.replace("#", "");
  const r = clamp(parseInt(h.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(h.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(h.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

interface UseTileLogicProps {
  row: number;
  data: SchedulerProjectData;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  truncateText?: boolean;
  /** Hide text for crowded recurring tiles */
  hideRecurringText?: boolean;
  onAssignTask?: (task: SchedulerProjectData, updatedTask: SchedulerProjectData, flag: null) => void;
  form?: { reset: (values: Record<string, unknown>) => void };
}

export function useTileLogic({
  row,
  data,
  reportPosition,
  truncateText,
  hideRecurringText,
  onAssignTask,
  form
}: UseTileLogicProps) {
  const { date, zoom, startDate, config } = useCalendar();
  const { includeTakenHoursOnWeekendsInDayView } = config;

  // Refs
  const tileRef = useRef<HTMLDivElement | null>(null);

  // State
  const [popupOpen, setPopupOpen] = useState(false);
  const [tileNode, setTileNode] = useState<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SchedulerProjectData | null>(null);

  // Utility function for date manipulation
  const setHoursToDate = useCallback((dateInput: string | number | Date, hours: number) => {
    const newDate = new Date(dateInput);
    newDate.setHours(hours);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  }, []);

  const [addTaskDate, setAddTaskDate] = useState<Date | undefined>(() =>
    setHoursToDate(new Date(), 17)
  );
  const [addTaskMonth, setAddTaskMonth] = useState<Date | undefined>(new Date());

  // Calculate tile properties
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


  // Memoized computed values
  const { endDate, isPast, effectiveIsHidden } = useMemo(() => {
    const endDate = new Date(data.dueDate);
    const now = new Date();
    const isPast = endDate < now;
    const effectiveIsHidden = isPast ? true : data.isCompleted ? true : isHidden;
    return { endDate, isPast, effectiveIsHidden };
  }, [data.dueDate, data.isCompleted, isHidden]);

  // Drag and drop
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${data.id}`,
    data: data
  });

  // Disable droppable when this tile is being dragged to prevent self-detection
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `${data.id}`,
    data: data,
    disabled: isDragging
  });

  // Combined ref callback
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setTileNode(node);
      tileRef.current = node;
      setNodeRef(node);
      setDroppableRef(node);
    },
    [setNodeRef, setDroppableRef]
  );

  // Modal handlers
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPopupOpen(false);
  }, []);

  // Popup handlers
  const handleMouseEnter = useCallback(() => setPopupOpen(true), []);
  const handleMouseLeavePopup = useCallback(() => setPopupOpen(false), []);

  // Debounced mouse handler - created once
  const debouncedHandleMouseOver = useMemo(
    () =>
      debounce(() => {
        if (!tileNode) return;
        // Mouse over logic can be extended here
      }, 300),
    [tileNode, includeTakenHoursOnWeekendsInDayView]
  );

  const handleMouseLeave = useCallback(() => {
    debouncedHandleMouseOver.cancel();
  }, [debouncedHandleMouseOver]);

  // Task toggle handler
  const handleTaskToggle = useCallback(() => {
    if (isDragging || isOver) return;

    setIsHidden((prev) => {
      const newVal = !prev;
      const updatedTask = {
        ...data,
        isCompleted: newVal
      };
      onAssignTask?.(data, updatedTask, null);
      return newVal;
    });
  }, [data, onAssignTask, isDragging, isOver]);

  // Actual truncate logic
  // Returns true when text should be allowed to overflow (untruncated)
  const actualTruncate = useMemo(() => {
    // While dragging, always truncate
    if (isDragging || isOver) return false;

    // If this is a crowded recurring tile that should hide text, force truncation
    if (hideRecurringText) return false;

    // Otherwise, use the truncateText setting
    return truncateText;
  }, [isDragging, isOver, truncateText, hideRecurringText]);

  // Base tile style - computed once, doesn't change during drag
  const baseTileStyle = useMemo(
    () => ({
      left: `${x}px`,
      top: `${y}px`,
      backgroundColor: `${data.bgColor ?? "#6E7FF5"}`,
      width: `${width}px`,
      color: "#000000",
      overflow: "visible" as const,
      boxSizing: "border-box" as const,
      borderLeft: `3px solid ${adjustColor(data.bgColor ?? "#6E7FF5", -30)}`
    }),
    [x, y, data.bgColor, width]
  );

  // Drag/hover styles - only these change during interaction
  const interactionStyle = useMemo(() => {
    const style: React.CSSProperties = {
      opacity: effectiveIsHidden ? 0.35 : 1
    };

    if (isDragging) {
      style.opacity = 0.85;
      style.zIndex = 9999;
      style.boxShadow = "0 12px 28px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.1)";
      style.cursor = "grabbing";
      style.borderRadius = "10px";
      if (transform) {
        style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.02)`;
      }
    }

    if (isOver) {
      style.backgroundColor = "#EBF2FF";
      style.border = "2px solid #6E7FF5";
      style.boxShadow = "0 0 0 3px rgba(110, 127, 245, 0.2)";
    }

    return style;
  }, [isDragging, isOver, effectiveIsHidden, transform]);

  // Combined tile style
  const tileStyle = useMemo(
    () => ({ ...baseTileStyle, ...interactionStyle }),
    [baseTileStyle, interactionStyle]
  );

  // Event listeners effect
  useEffect(() => {
    if (isDragging || isOver) return;

    const handleMouseOver = () => debouncedHandleMouseOver();
    const gridArea = tileNode;
    if (!gridArea) return;

    gridArea.addEventListener("mousemove", handleMouseOver);
    gridArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridArea.removeEventListener("mousemove", handleMouseOver);
      gridArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [tileNode, debouncedHandleMouseOver, handleMouseLeave, startDate, isDragging, isOver]);

  // Position reporting effect - use CSS positions directly (x, y from tileProperties)
  // These are container-relative, not viewport-relative, so they stay stable during scroll
  useLayoutEffect(() => {
    // Report position using the CSS coordinates directly
    // This ensures arrows stay in sync with tiles regardless of scroll position
    const pos = {
      x: x,
      y: y,
      width: width,
      height: tileHeight
    };

    reportPosition?.(data.id, pos);
  }, [x, y, width, data.id, reportPosition]);

  // Form reset effect
  useEffect(() => {
    if (selectedTask && form) {
      // Use type assertion for properties that may exist on task but aren't in type definition
      const task = selectedTask as SchedulerProjectData & { userId?: string; reminder?: string };
      form.reset({
        from: "",
        name: task.name || "",
        userId: task.userId || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : addTaskDate,
        time: task.dueTime || 17,
        recurring: task.recurring || null,
        reminder: task.reminder || "None",
        isRecurring: task.isRecurring || false
      });
    }
  }, [form, selectedTask, addTaskDate]);

  return {
    // State
    popupOpen,
    isModalOpen,
    tileNode,
    addTaskDate,
    addTaskMonth,
    selectedTask,

    // Setters
    setAddTaskDate,
    setAddTaskMonth,
    setSelectedTask,

    // Computed
    actualTruncate,
    tileStyle,
    effectiveIsHidden,
    isPast,

    // Drag & Drop
    attributes,
    listeners,
    isDragging,
    isOver,
    combinedRef,

    // Handlers
    handleMouseEnter,
    handleMouseLeavePopup,
    handleTaskToggle,
    openModal,
    closeModal
  };
}
