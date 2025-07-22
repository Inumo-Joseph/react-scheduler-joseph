import { useTheme } from "styled-components";
import { FC, MouseEventHandler, useState } from "react";
import {
  ArrowRightFromLine,
  ArrowRightToLineIcon,
  Calendar,
  LucideLogIn,
  MoveRightIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckSquare2Icon
} from "lucide-react";
import { Button } from "semantic-ui-react";
import { Icon, IconButton, Toggle } from "@/components";

import { useCalendar } from "@/context/CalendarProvider";
import { useLanguage } from "@/context/LocaleProvider";
import {
  NavigationWrapper,
  Wrapper,
  NavBtn,
  Today,
  Zoom,
  Filters,
  OptionsContainer
} from "./styles";
import { TopbarProps } from "./types";

const Topbar: FC<TopbarProps> = ({
  width,
  showThemeToggle,
  toggleTheme,
  setTruncate,
  truncateText,
  showCompleted,
  setShowCompleted
}) => {
  const { topbar } = useLanguage();
  const {
    data,
    config,
    handleGoNext,
    handleGoPrev,
    handleGoToday,
    zoomIn,
    zoomOut,
    isNextZoom,
    isPrevZoom,
    handleFilterData,
    onClearFilterData
  } = useCalendar();
  const { colors } = useTheme();
  const { filterButtonState = -1 } = config;

  return (
    <Wrapper width={width}>
      <div className="" style={{ paddingTop: "1px" }}></div>

      <NavigationWrapper></NavigationWrapper>

      <OptionsContainer>{showThemeToggle && <Toggle toggleTheme={toggleTheme} />}</OptionsContainer>
    </Wrapper>
  );
};
export default Topbar;
