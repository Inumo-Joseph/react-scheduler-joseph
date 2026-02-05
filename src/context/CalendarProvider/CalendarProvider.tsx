import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import duration from "dayjs/plugin/duration";
import debounce from "lodash.debounce";
import { ZoomLevel, allZoomLevel } from "@/types/global";
import { isAvailableZoom } from "@/types/guards";
import { getDatesRange, getParsedDatesRange } from "@/utils/getDatesRange";
import { parseDay } from "@/utils/dates";
import { getCols, getVisibleCols } from "@/utils/getCols";
import {
  buttonWeeksJump,
  hoursInDay,
  outsideWrapperId,
  screenWidthMultiplier,
  zoom2ButtonJump
} from "@/constants";
import { getCanvasWidth } from "@/utils/getCanvasWidth";
import { calendarContext } from "./calendarContext";
import { CalendarProviderProps } from "./types";
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(duration);

type Direction = "back" | "forward" | "middle";
type DebouncedScrollFn = ReturnType<typeof debounce<(behavior?: ScrollBehavior) => void>>;

const CalendarProvider = ({
  data,
  children,
  isLoading,
  config,
  schedulerZoom,
  defaultStartDate = dayjs(),
  onRangeChange,
  onFilterData,
  onClearFilterData,
  todayClicked,
  hideCheckedItems
}: CalendarProviderProps) => {
  const { zoom: configZoom, maxRecordsPerPage = 25 } = config;

  let z = schedulerZoom;

  useEffect(() => {
    switch (schedulerZoom) {
      case "":
        z = configZoom;
        break;

      case "0":
        z = 0;
        break;

      case "1":
        z = 1;
        break;

      case "3":
        z = 3;
        break;

      default:
        z = configZoom;
        break;
    }
    changeZoom(z);
  }, [schedulerZoom]);

  const [zoom, setZoom] = useState<ZoomLevel>(configZoom);
  const [date, setDate] = useState(dayjs());
  const [isInitialized, setIsInitialized] = useState(false);
  const [cols, setCols] = useState(getCols(zoom));
  const isNextZoom = allZoomLevel[zoom] !== allZoomLevel[allZoomLevel.length - 1];
  const isPrevZoom = zoom !== 0;
  const range = useMemo(() => getParsedDatesRange(date, zoom), [date, zoom]);
  const startDate = getDatesRange(date, zoom).startDate;
  const dayOfYear = dayjs(startDate).dayOfYear();
  const parsedStartDate = parseDay(startDate);
  const outsideWrapper = useRef<HTMLElement | null>(null);

  // Create stable debounced scroll functions (fixes anti-pattern of creating new debounce on each call)
  const debouncedScrollForward = useRef<DebouncedScrollFn>();
  const debouncedScrollBack = useRef<DebouncedScrollFn>();
  const debouncedScrollMiddle = useRef<DebouncedScrollFn>();
  const debouncedDateUpdate = useRef<ReturnType<typeof debounce>>();

  const moveHorizontalScroll = useCallback(
    (direction: Direction, behavior: ScrollBehavior = "auto") => {
      const canvasWidth = getCanvasWidth();

      switch (direction) {
        case "back":
          return outsideWrapper.current?.scrollTo({
            behavior,
            left: canvasWidth / 3
          });

        case "forward":
          return outsideWrapper.current?.scrollTo({
            behavior,
            left: canvasWidth / 3
          });

        case "middle": {
          const leftOffset = canvasWidth / screenWidthMultiplier / 4; // 1/4 of component's width
          return outsideWrapper.current?.scrollTo({
            behavior,
            left: canvasWidth / 2 - leftOffset
          });
        }

        default:
          return outsideWrapper.current?.scrollTo({
            behavior,
            left: canvasWidth / 2
          });
      }
    },
    []
  );

  // Calculate offset based on zoom level
  const getDateOffset = useCallback((currentZoom: ZoomLevel) => {
    const cols = getVisibleCols(currentZoom);
    switch (currentZoom) {
      case 0:
        return cols * 7;
      case 1:
        return cols;
      case 2:
        return Math.ceil(cols / hoursInDay);
      case 3:
        return cols * 30;
      default:
        return cols;
    }
  }, []);

  // Stable date update functions - created once, not on every call
  const updateDateBack = useCallback(() => {
    const offset = getDateOffset(zoom);
    setDate((prev) => prev.subtract(offset, "days"));
    onRangeChange?.(range);
  }, [zoom, getDateOffset, onRangeChange, range]);

  const updateDateForward = useCallback(() => {
    const offset = getDateOffset(zoom);
    setDate((prev) => prev.add(offset, "days"));
    onRangeChange?.(range);
  }, [zoom, getDateOffset, onRangeChange, range]);

  const updateDateMiddle = useCallback(() => {
    setDate(dayjs());
    onRangeChange?.(range);
  }, [onRangeChange, range]);

  // Initialize debounced functions once and update refs when dependencies change
  useEffect(() => {
    debouncedDateUpdate.current?.cancel();
    debouncedDateUpdate.current = debounce((direction: Direction) => {
      switch (direction) {
        case "back":
          updateDateBack();
          break;
        case "forward":
          updateDateForward();
          break;
        case "middle":
          updateDateMiddle();
          break;
      }
    }, 300);

    return () => {
      debouncedDateUpdate.current?.cancel();
    };
  }, [updateDateBack, updateDateForward, updateDateMiddle]);

  const loadMore = useCallback((direction: Direction) => {
    debouncedDateUpdate.current?.(direction);
  }, []);

  useEffect(() => {
    // Only act when prop changes
    if (todayClicked || !todayClicked) {
      goToToday();
    }
  }, [todayClicked]);

  useEffect(() => {
    outsideWrapper.current = document.getElementById(outsideWrapperId);
    setCols(getCols(zoom));
  }, [zoom]);

  useEffect(() => {
    const handleResize = () => setCols(getCols(zoom));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom]);

  useEffect(() => {
    onRangeChange?.(range);
  }, [onRangeChange, range]);

  useEffect(() => {
    // when defaultStartDate changes repaint grid
    setIsInitialized(false);
  }, [defaultStartDate]);

  useEffect(() => {
    if (isInitialized) return;

    moveHorizontalScroll("middle");
    setIsInitialized(true);
    setDate(defaultStartDate);
  }, [defaultStartDate, isInitialized, moveHorizontalScroll]);

  const handleGoNext = () => {
    if (isLoading) return;

    setDate((prev) =>
      zoom === 2 ? prev.add(zoom2ButtonJump, "hours") : prev.add(buttonWeeksJump, "weeks")
    );
    onRangeChange?.(range);
  };

  // Initialize stable debounced scroll functions
  useEffect(() => {
    debouncedScrollForward.current?.cancel();
    debouncedScrollBack.current?.cancel();
    debouncedScrollMiddle.current?.cancel();

    debouncedScrollForward.current = debounce((behavior?: ScrollBehavior) => {
      moveHorizontalScroll("forward", behavior);
    }, 300);

    debouncedScrollBack.current = debounce((behavior?: ScrollBehavior) => {
      moveHorizontalScroll("back", behavior);
    }, 300);

    debouncedScrollMiddle.current = debounce((behavior?: ScrollBehavior) => {
      moveHorizontalScroll("middle", behavior);
    }, 300);

    return () => {
      debouncedScrollForward.current?.cancel();
      debouncedScrollBack.current?.cancel();
      debouncedScrollMiddle.current?.cancel();
    };
  }, [moveHorizontalScroll]);

  const handleScrollNext = useCallback(() => {
    if (isLoading) return;
    loadMore("forward");
    debouncedScrollForward.current?.();
  }, [isLoading, loadMore]);

  const handleGoPrev = () => {
    if (isLoading) return;

    setDate((prev) =>
      zoom === 2 ? prev.subtract(zoom2ButtonJump, "hours") : prev.subtract(buttonWeeksJump, "weeks")
    );
    onRangeChange?.(range);
  };

  const handleScrollPrev = useCallback(() => {
    if (!isInitialized || isLoading) return;
    loadMore("back");
    debouncedScrollBack.current?.();
  }, [isInitialized, isLoading, loadMore]);

  const goToToday = useCallback(() => {
    if (isLoading) return;
    loadMore("middle");
    debouncedScrollMiddle.current?.("smooth");
  }, [isLoading, loadMore]);

  const zoomIn = () => changeZoom(zoom + 1);

  const zoomOut = () => changeZoom(zoom - 1);

  const changeZoom = (zoomLevel: number) => {
    if (!isAvailableZoom(zoomLevel)) return;
    setZoom(zoomLevel);
    setCols(getCols(zoomLevel));
    onRangeChange?.(range);
  };

  const handleFilterData = () => onFilterData?.();

  const { Provider } = calendarContext;

  return (
    <Provider
      value={{
        data,
        config,
        handleGoNext,
        handleScrollNext,
        handleGoPrev,
        handleScrollPrev,
        handleGoToday: goToToday,
        zoomIn,
        zoomOut,
        zoom,
        isNextZoom,
        isPrevZoom,
        date,
        isLoading,
        cols,
        startDate: parsedStartDate,
        dayOfYear,
        handleFilterData,
        recordsThreshold: maxRecordsPerPage,
        onClearFilterData
      }}>
      {children}
    </Provider>
  );
};

const useCalendar = () => useContext(calendarContext);

export default CalendarProvider;
export { useCalendar };
