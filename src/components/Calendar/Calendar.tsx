import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState, Dispatch } from "react";
import debounce from "lodash.debounce";
import { ChevronsLeftRightEllipsisIcon } from "lucide-react";
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
import UsersIcon from "../UserIcon";
import { CalendarProps } from "./types";
import { StyledOuterWrapper, StyledInnerWrapper, StyledEmptyBoxWrapper } from "./styles";

const initialTooltipData: TooltipData = {
  coords: { x: 0, y: 0 },
  resourceIndex: 0,
  disposition: {
    taken: { hours: 0, minutes: 0 },
    free: { hours: 0, minutes: 0 },
    overtime: { hours: 0, minutes: 0 }
  }
};

export const Calendar: FC<CalendarProps> = ({
  data,
  onItemClick,
  toggleTheme,
  topBarWidth,
  renderData,
  schedulerRef,
  tasks,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  subDispatch,
  subEntryActions,
  form
}) => {
  const [tooltipData, setTooltipData] = useState<TooltipData>(initialTooltipData);
  const [filteredData, setFilteredData] = useState(data);
  const [isVisible, setIsVisible] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const {
    zoom,
    startDate,
    config: { includeTakenHoursOnWeekendsInDayView, showTooltip, showThemeToggle }
  } = useCalendar();

  const gridRef = useRef<HTMLDivElement>(null);
  // const tileRef = useRef<Record<string, React.RefObject<HTMLButtonElement>>>({});
  const [truncateText, setTruncateText] = useState(false);
  const [hoveredTileData, setHoveredTileData] = useState<SchedulerProjectData | null>(null);
  const [hoveredTileRef, setHoveredTileRef] = useState<React.RefObject<HTMLButtonElement> | null>(
    null
  );
  const [showCompleted, setShowCompleted] = useState(false);

  const handleTileHover = (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => {
    setHoveredTileData(data);
    setHoveredTileRef(ref);
  };

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
  } = usePagination(filteredData);

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
          zoom,
          includeTakenHoursOnWeekendsInDayView
        );

        setTooltipData({ coords: { x, y }, resourceIndex, disposition });
        setIsVisible(true);
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

  const handleMouseLeave = useCallback(() => {
    debouncedHandleMouseOver.current.cancel();
    setIsVisible(false);
    setTooltipData(initialTooltipData);
  }, []);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) =>
      debouncedHandleMouseOver.current(e, startDate, rowsPerItem, projectsPerPerson, zoom);
    const gridArea = gridRef?.current;
    if (!gridArea) return;
    gridArea.addEventListener("mousemove", handleMouseOver);
    gridArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridArea.removeEventListener("mousemove", handleMouseOver);
      gridArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [debouncedHandleMouseOver, handleMouseLeave, projectsPerPerson, rowsPerItem, startDate, zoom]);

  useEffect(() => {
    if (searchPhrase) return;
    setFilteredData(data);
  }, [data, searchPhrase, hoveredTileData]);

  return (
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
      />
      <StyledInnerWrapper>
        <Header
          zoom={zoom}
          topBarWidth={topBarWidth}
          showThemeToggle={showThemeToggle}
          toggleTheme={toggleTheme}
          truncateText={truncateText}
          setTruncate={setTruncateText}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
        />
        {data.length ? (
          <Grid
            data={page}
            zoom={zoom}
            rows={totalRowsPerPage}
            ref={gridRef}
            schedulerRef={schedulerRef}
            onTileHover={handleTileHover}
            projectData={data}
            truncateText={truncateText}
            showToggle={setTruncateText}
            renderData={renderData}
            parentChildTask={parentChildTask}
            alarmClock={alarmClock}
            Users={Users}
            hideCheckedItems={hideCheckedItems}
            tasks={tasks}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            subDispatch={subDispatch}
            subEntryActions={subEntryActions}
            form={form}
          />
        ) : (
          <StyledEmptyBoxWrapper width={topBarWidth}>
            <EmptyBox />
          </StyledEmptyBoxWrapper>
        )}
        {/* {showTooltip && isVisible && tooltipData?.resourceIndex > -1 && (
          <div
          onMouseEnter={()=>setIsHoveringTooltip(true)}
          onMouseLeave={()=>setIsHoveringTooltip(false)}
          >
          <Tooltip tooltipData={tooltipData} zoom={zoom} content={toolContent(hoveredTileData?.users ?? [''])} />
          </div>
        )} */}
      </StyledInnerWrapper>
    </StyledOuterWrapper>
  );
};

export default Calendar;
