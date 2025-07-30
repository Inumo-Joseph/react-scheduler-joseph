import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  Dispatch,
  useMemo
} from "react";
import debounce from "lodash.debounce";
import { ChevronsLeftRightEllipsisIcon } from "lucide-react";
import dayjs from "dayjs";
import { useCalendar } from "@/context/CalendarProvider";
import {
  Day,
  SchedulerData,
  SchedulerProjectData,
  TooltipData,
  ZoomLevel,
  SchedulerRow
} from "@/types/global";
import { getTooltipData } from "@/utils/getTooltipData";
import { usePagination } from "@/hooks/usePagination";
import EmptyBox from "../EmptyBox";
import { Grid, Header, LeftColumn, Tooltip } from "..";
import { StyledInputWrapper, StyledLeftColumnHeader, StyledWrapper } from "../LeftColumn/styles";
import { CalendarProps } from "./types";
import { StyledOuterWrapper, StyledInnerWrapper, StyledEmptyBoxWrapper } from "./styles";

export const Calendar: FC<CalendarProps> = ({
  data,
  onItemClick,
  toggleTheme,
  schedulerZoom,
  topBarWidth,
  renderData,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  onAssignTask,
  form,
  addTaskButton,
  schedulerTruncateText,
  reccuringIcon,
  SchedulerRef,
  setClickedTask,
  taskInteractionProps
}) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const {
    zoom,
    startDate,
    config: { includeTakenHoursOnWeekendsInDayView, showTooltip, showThemeToggle }
  } = useCalendar();
  const gridRef = useRef<HTMLDivElement>(null);
  const [truncateText, setTruncateText] = useState(false);
  const [hoveredTileData, setHoveredTileData] = useState<SchedulerProjectData | null>(null);
  const [hoveredTileRef, setHoveredTileRef] = useState<React.RefObject<HTMLButtonElement> | null>(
    null
  );
  const [gridScale, setGridScale] = useState(1);
  const [showCompleted, setShowCompleted] = useState(false);
  const handleTileHover = (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => {
    setHoveredTileData(data);
    setHoveredTileRef(ref);
  };

  const [filteredData, setFilteredData] = useState(data);

  const expandedFilteredData = useMemo(() => {
    return filteredData.map((row) => {
      const expandedTasks: SchedulerProjectData[] = [];

      row.data.forEach((task) => {
        expandedTasks.push(task);

        if (task.isRecurring && task.recurring) {
          let nextDate = dayjs(task.startDate);
          let endDate = dayjs(task.dueDate);
          for (let i = 1; i <= 3; i++) {
            switch (task.recurring.toLowerCase()) {
              case "daily":
                nextDate = nextDate.add(1, "day");
                endDate = endDate.add(1, "day");
                break;
              case "weekly":
                nextDate = nextDate.add(1, "week");
                endDate = endDate.add(1, "week");
                break;
              case "monthly":
                nextDate = nextDate.add(1, "month");
                endDate = endDate.add(1, "month");
                break;
              case "yearly":
                nextDate = nextDate.add(1, "year");
                endDate = endDate.add(1, "year");
                break;
              default:
                break;
            }

            expandedTasks.push({
              ...task,
              id: `${task.id}-recurring-${i}`,
              startDate: nextDate.toDate(),
              dueDate: endDate.toDate()
            });
          }
        }
      });

      return {
        ...row,
        data: expandedTasks
      };
    });
  }, [filteredData]);

  const {
    page,
    projectsPerPerson,
    totalRowsPerPage,
    rowsPerItem,
    rowsPerPerson,
    currentPageNum,
    pagesAmount,
    next,
    previous,
    reset
  } = usePagination(expandedFilteredData);

  const debouncedHandleMouseOver = useRef(
    debounce(
      (
        e: MouseEvent,
        startDate: Day,
        rowsPerItem: number[],
        projectsPerPerson: SchedulerProjectData[][][],
        zoom: ZoomLevel
      ) => {
        if (!gridRef?.current) return;

        const { left, top } = gridRef.current.getBoundingClientRect();
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
          schedulerZoom,
          includeTakenHoursOnWeekendsInDayView
        );
      },
      300
    )
  );

  const debouncedFilterData = useRef(
    debounce((dataToFilter: SchedulerData, enteredSearchPhrase: string) => {
      reset();
      setFilteredData(
        dataToFilter.filter((item) =>
          item.label.title.toLowerCase().includes(enteredSearchPhrase.toLowerCase())
        )
      );
    }, 500)
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const phrase = event.target.value;
    setSearchPhrase(phrase);
    debouncedFilterData.current.cancel();
    debouncedFilterData.current(data, phrase);
  };

  useEffect(() => {
    if (searchPhrase) return;
    setFilteredData(data);
  }, [data, searchPhrase, hoveredTileData]);

  return (
    <div
      style={{
        transformOrigin: "center",
        width: "max-content"
      }}>
      <StyledOuterWrapper>
        <LeftColumn
          data={page}
          pageNum={currentPageNum}
          pagesAmount={pagesAmount}
          rows={rowsPerItem}
          onLoadNext={next}
          onLoadPrevious={previous}
          searchInputValue={searchPhrase}
          onSearchInputChange={handleSearch}
          onItemClick={onItemClick}
          addTaskButton={addTaskButton}
        />

        <StyledInnerWrapper>
          <Header
            zoom={zoom}
            topBarWidth={topBarWidth}
            Rows={rowsPerPerson?.reduce((acc, value) => acc + value, 0) || totalRowsPerPage}
            showThemeToggle={showThemeToggle}
            toggleTheme={toggleTheme}
            truncateText={schedulerTruncateText}
            setTruncate={setTruncateText}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
          />

          {data.length ? (
            <div>
              <Grid
                data={page}
                zoom={zoom}
                rows={rowsPerItem?.reduce((acc, value) => acc + value, 0) || totalRowsPerPage}
                ref={gridRef}
                onTileHover={handleTileHover}
                projectData={data}
                truncateText={schedulerTruncateText}
                showToggle={setTruncateText}
                renderData={renderData}
                parentChildTask={parentChildTask}
                alarmClock={alarmClock}
                Users={Users}
                hideCheckedItems={hideCheckedItems}
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                onAssignTask={onAssignTask}
                form={form}
                SchedulerRef={SchedulerRef}
                reccuringIcon={reccuringIcon}
                taskInteractionProps={taskInteractionProps}
                filteredData={page}
                setClickedTask={setClickedTask}
              />
            </div>
          ) : (
            <StyledEmptyBoxWrapper width={topBarWidth}>
              <EmptyBox />
            </StyledEmptyBoxWrapper>
          )}
        </StyledInnerWrapper>
      </StyledOuterWrapper>
    </div>
  );
};

export default Calendar;
