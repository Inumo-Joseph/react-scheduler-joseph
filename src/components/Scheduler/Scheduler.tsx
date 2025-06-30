import { ThemeProvider } from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components";
import CalendarProvider, { useCalendar } from "@/context/CalendarProvider";
import LocaleProvider from "@/context/LocaleProvider";
import { darkTheme, GlobalStyle, theme } from "@/styles";
import { Config } from "@/types/global";
import { outsideWrapperId } from "@/constants";
import { drawDependencyArrows } from "@/utils/drawDependencyArrows";
import { SchedulerProps } from "./types";
import { StyledInnerWrapper, StyledOutsideWrapper } from "./styles";

const Scheduler = ({
  data,
  config,
  startDate,
  onRangeChange,
  onFilterData,
  onClearFilterData,
  onItemClick,
  isLoading,
  renderData,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  onAssignTask,
  form,
  addTaskButton,
  schedulerZoom,
  schedulerTruncate,
  todayClicked,
  schedulerSize
}: SchedulerProps) => {
  // eslint-disable-next-line
  const appConfig: Config = React.useMemo(
    () => ({
      zoom: 0,
      filterButtonState: 1,
      includeTakenHoursOnWeekendsInDayView: false,
      showTooltip: true,
      translations: undefined,
      ...config
    }),
    [config]
  );

  const { handleGoToday } = useCalendar();

  const outsideWrapperRef = useRef<HTMLDivElement>(null);
  const [topBarWidth, setTopBarWidth] = useState(outsideWrapperRef.current?.clientWidth);
  const defaultStartDate = useMemo(() => dayjs(startDate), [startDate]);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(appConfig.defaultTheme ?? "light");
  const toggleTheme = () => {
    themeMode === "light" ? setThemeMode("dark") : setThemeMode("light");
  };
  const currentTheme = themeMode === "light" ? theme : darkTheme;
  const customColors = appConfig.theme ? appConfig.theme[currentTheme.mode] : {};
  const mergedTheme = {
    ...currentTheme,
    colors: {
      ...currentTheme.colors,
      ...customColors
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (outsideWrapperRef.current) {
        setTopBarWidth(outsideWrapperRef.current.clientWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let filteredData = data;

  if (hideCheckedItems) {
    filteredData = data
      .map((row) => ({
        ...row,
        data: row.data.filter((task) => !task.isCompleted)
      }))
      .filter((row) => row.data.length > 0); // remove rows with no completed tasks
  }

  if (!outsideWrapperRef.current) null;
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={mergedTheme}>
        <LocaleProvider lang={appConfig.lang} translations={appConfig.translations}>
          <CalendarProvider
            data={filteredData}
            isLoading={!!isLoading}
            config={appConfig}
            onRangeChange={onRangeChange}
            defaultStartDate={defaultStartDate}
            onFilterData={onFilterData}
            schedulerZoom={schedulerZoom}
            onClearFilterData={onClearFilterData}
            todayClicked={todayClicked}>
            <StyledOutsideWrapper
              showScroll={!!data.length}
              id={outsideWrapperId}
              ref={outsideWrapperRef}>
              <StyledInnerWrapper>
                <Calendar
                  data={filteredData}
                  renderData={renderData}
                  topBarWidth={topBarWidth ?? 0}
                  onItemClick={onItemClick}
                  toggleTheme={toggleTheme}
                  schedulerRef={outsideWrapperRef}
                  parentChildTask={parentChildTask}
                  alarmClock={alarmClock}
                  Users={Users}
                  hideCheckedItems={hideCheckedItems}
                  onAssignTask={onAssignTask}
                  form={form}
                  schedulerZoom={schedulerZoom}
                  schedulerTruncateText={schedulerTruncate}
                  addTaskButton={addTaskButton}
                  calendarScale={schedulerSize}
                />
              </StyledInnerWrapper>
            </StyledOutsideWrapper>
          </CalendarProvider>
        </LocaleProvider>
      </ThemeProvider>
    </>
  );
};

export default Scheduler;
