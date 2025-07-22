import {
  SetStateAction,
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
import { Coords, ZoomLevel, allZoomLevel } from "@/types/global";
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
  todayClicked
}: CalendarProviderProps) => {
  const { zoom: configZoom, maxRecordsPerPage = 50 } = config;
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
  type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;

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

  const loadMore = useCallback(
    (direction: Direction) => {
      const cols = getVisibleCols(zoom);
      let offset: number;
      switch (zoom) {
        case 0:
          offset = cols * 7;
          break;
        case 1:
          offset = cols;
          break;
        case 2:
          offset = Math.ceil(cols / hoursInDay);
          break;
        case 3:
          offset = cols * 30;
          break;
      }
      const load = debounce(() => {
        switch (direction) {
          case "back":
            setDate((prev) => prev.subtract(offset, "days"));
            break;
          case "forward":
            setDate((prev) => prev.add(offset, "days"));
            break;
          case "middle":
            setDate(dayjs());
            break;
        }
        onRangeChange?.(range);
      }, 300);
      load();
    },
    [onRangeChange, range, zoom]
  );

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

  const handleScrollNext = useCallback(() => {
    if (isLoading) return;

    loadMore("forward");
    debounce(() => {
      moveHorizontalScroll("forward");
    }, 300)();
  }, [isLoading, loadMore, moveHorizontalScroll]);

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
    debounce(() => {
      moveHorizontalScroll("back");
    }, 300)();
  }, [isInitialized, isLoading, loadMore, moveHorizontalScroll]);

  const goToToday = useCallback(() => {
    if (isLoading) return;
    loadMore("middle");
    debounce(() => {
      moveHorizontalScroll("middle", "smooth");
    }, 300)();
  }, [isLoading, loadMore, moveHorizontalScroll]);

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
