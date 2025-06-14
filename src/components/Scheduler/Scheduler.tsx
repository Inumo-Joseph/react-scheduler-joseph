import { ThemeProvider } from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components";
import CalendarProvider from "@/context/CalendarProvider";
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
  tasks,
  renderData,
  parentChildTask,
  alarmClock,
  Users,
  hideCheckedItems,
  subDispatch,
  subEntryActions,
  form
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

  if (!outsideWrapperRef.current) null;
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={mergedTheme}>
        <LocaleProvider lang={appConfig.lang} translations={appConfig.translations}>
          <CalendarProvider
            data={data}
            isLoading={!!isLoading}
            config={appConfig}
            onRangeChange={onRangeChange}
            defaultStartDate={defaultStartDate}
            onFilterData={onFilterData}
            onClearFilterData={onClearFilterData}>
            <StyledOutsideWrapper
              showScroll={!!data.length}
              id={outsideWrapperId}
              ref={outsideWrapperRef}>
              <StyledInnerWrapper>
                <Calendar
                  data={data}
                  renderData={renderData}
                  topBarWidth={topBarWidth ?? 0}
                  onItemClick={onItemClick}
                  toggleTheme={toggleTheme}
                  schedulerRef={outsideWrapperRef}
                  parentChildTask={parentChildTask}
                  alarmClock={alarmClock}
                  Users={Users}
                  hideCheckedItems={hideCheckedItems}
                  tasks={tasks}
                  subDispatch={subDispatch}
                  subEntryActions={subEntryActions}
                  form={form}
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
