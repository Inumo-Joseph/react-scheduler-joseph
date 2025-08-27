import { ThemeProvider } from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components";
import CalendarProvider, { useCalendar } from "@/context/CalendarProvider";
import LocaleProvider from "@/context/LocaleProvider";
import { darkTheme, GlobalStyle, theme } from "@/styles";
import { Config } from "@/types/global";
import { outsideWrapperId } from "@/constants";
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
  reccuringIcon,
  setClickedTask,
  taskInteractionProps
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

  const handleResize = () => {
    if (outsideWrapperRef.current) {
      setTopBarWidth(outsideWrapperRef.current.clientWidth);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    const processedData = data;

    return processedData.map((row) => ({
      ...row,
      data: row.data.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : null;
        const dateB = b.dueDate ? new Date(b.dueDate) : null;

        // Handle null dates (put them at the end)
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        // Calculate days from today
        const daysFromTodayA = Math.floor(
          (dateA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        const daysFromTodayB = Math.floor(
          (dateB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Priority order: future dates, today, recent past, then old past
        // Future dates and today first (ascending order)
        if (daysFromTodayA >= 0 && daysFromTodayB >= 0) {
          return daysFromTodayA - daysFromTodayB;
        }

        // If one is future/today and one is past, prioritize future/today
        if (daysFromTodayA >= 0 && daysFromTodayB < 0) return -1;
        if (daysFromTodayA < 0 && daysFromTodayB >= 0) return 1;

        // Both are in the past - prioritize more recent past (less negative = more recent)
        return daysFromTodayB - daysFromTodayA;
      })
    }));
  }, [data, hideCheckedItems]);

  if (!data?.length && !isLoading) {
    return null;
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
            todayClicked={todayClicked}
            hideCheckedItems={hideCheckedItems}>
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
                  parentChildTask={parentChildTask}
                  alarmClock={alarmClock}
                  Users={Users}
                  hideCheckedItems={hideCheckedItems}
                  onAssignTask={onAssignTask}
                  form={form}
                  schedulerZoom={schedulerZoom}
                  schedulerTruncateText={schedulerTruncate}
                  addTaskButton={addTaskButton}
                  SchedulerRef={outsideWrapperRef}
                  reccuringIcon={reccuringIcon}
                  taskInteractionProps={taskInteractionProps}
                  setClickedTask={setClickedTask}
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
