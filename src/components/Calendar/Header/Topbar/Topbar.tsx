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

  const handleClearFilters: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onClearFilterData?.();
  };

  const toggleShowCompleted = () => {
    // console.log("Changing showcompleted", showCompleted, "to", !showCompleted)
    setShowCompleted?.(!showCompleted);
  };

  return (
    <Wrapper width={width}>
      <div className="" style={{ paddingTop: "10px" }}>
        <span
          className=""
          style={{
            borderColor: "black",
            borderRadius: "10px",
            padding: "10px",
            marginTop: "10px"
          }}>
          <button className="">
            <Zoom>
              <IconButton
                isDisabled={!isPrevZoom}
                onClick={zoomOut}
                isFullRounded
                iconName="subtract"
                width="14"
              />

              <span className=""> Months-Quarters, Days-Weeks </span>

              <IconButton
                isDisabled={!isNextZoom}
                onClick={zoomIn}
                isFullRounded
                iconName="add"
                width="14"
              />
            </Zoom>
          </button>
        </span>
        <span className="" style={{ borderColor: "black", marginTop: "10px" }}>
          <Button
            className=""
            onClick={() => {
              setTruncate?.(!truncateText);
            }}>
            <ArrowRightToLineIcon
              style={{
                ...(truncateText && {
                  color: "green"
                })
              }}></ArrowRightToLineIcon>
          </Button>
        </span>

        <Button className=" " onClick={toggleShowCompleted}>
          {" "}
          <CheckSquare2Icon
            style={{
              ...(showCompleted && {
                color: "green"
              })
            }}></CheckSquare2Icon>
        </Button>

        <span style={{ paddingTop: "10px" }}>
          <Button onClick={handleGoToday}>
            <Calendar width={"25"}> </Calendar>
          </Button>
        </span>

        <Button disabled={!data?.length} style={{ cursor: "" }}>
          <ArrowLeftCircleIcon onClick={handleGoPrev}>{topbar.prev}</ArrowLeftCircleIcon>
        </Button>
        <Button disabled={!data?.length} style={{ cursor: "" }}>
          <ArrowRightCircleIcon onClick={handleGoNext}>{topbar.next}</ArrowRightCircleIcon>
        </Button>
      </div>

      <NavigationWrapper></NavigationWrapper>

      {/* <Filters>
        {filterButtonState >= 0 && (
          <IconButton
            variant={filterButtonState ? "filled" : "outlined"}
            iconName="filter"
            width="16"
            height="16"
            onClick={handleFilterData}>
            {topbar.filters}
            {!!filterButtonState && (
              <span onClick={handleClearFilters}>
                <Icon iconName="close" height="16" width="16" fill={colors.textSecondary} />
              </span>
            )}
          </IconButton>
        )}
      </Filters> */}

      <OptionsContainer>{showThemeToggle && <Toggle toggleTheme={toggleTheme} />}</OptionsContainer>
    </Wrapper>
  );
};
export default Topbar;
