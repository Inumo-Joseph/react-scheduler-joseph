import { useTheme } from "styled-components";
import { FC, MouseEventHandler } from "react";
import {
  ArrowRightFromLine,
  ArrowRightToLineIcon,
  Calendar,
  LucideLogIn,
  MoveRightIcon
} from "lucide-react";
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
  truncateText
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

  return (
    <Wrapper width={width}>
      {/* <Today onClick={handleGoToday}>{topbar.today}</Today> */}

      <div className="grid grid-flow-col gap-4" style={{ borderColor: "red" }}>
        <span className="text-[#273754] border border-[#273754] bg-[white] px-1 py-1 rounded-lg">
          <Calendar width={"25"} onClick={handleGoToday}>
            {" "}
          </Calendar>
          <span className=""></span>
        </span>

        <button className="text-[#273754] border border-[#273754] bg-[white] px-1 py-1 rounded-lg">
          <Zoom>
            <IconButton
              isDisabled={!isPrevZoom}
              onClick={zoomOut}
              isFullRounded
              iconName="subtract"
              width="14"
            />

            <span className=" "> Days Weeks Months Quarters</span>

            <IconButton
              isDisabled={!isNextZoom}
              onClick={zoomIn}
              isFullRounded
              iconName="add"
              width="14"
            />
          </Zoom>
        </button>

        <button className="bg-[white] text-[#273754] border border-[#273754] bg-[white] px-3 py-1 rounded-lg">
          <ArrowRightFromLine></ArrowRightFromLine>
        </button>

        <button
          className="bg-[white] text-[#273754] border border-[#273754] bg-[white] px-3 py-1 rounded-lg"
          onClick={() => {
            setTruncate?.(!truncateText);
          }}>
          <ArrowRightToLineIcon
            style={{
              ...(truncateText && {
                color: "green"
              })
            }}></ArrowRightToLineIcon>
        </button>

        <button className="bg-[white] text-[#273754] border border-[#273754] bg-[white] px-3 py-1 rounded-lg">
          Show/Hide Checked Items{" "}
        </button>
      </div>

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

      <NavigationWrapper>
        <NavBtn disabled={!data?.length} onClick={handleGoPrev}>
          <Icon iconName="arrowLeft" height="15" fill={colors.textPrimary} />
          {topbar.prev}
        </NavBtn>
        <NavBtn disabled={!data?.length} onClick={handleGoNext}>
          {topbar.next}
          <Icon iconName="arrowRight" height="15" fill={colors.textPrimary} />
        </NavBtn>
      </NavigationWrapper>
      <OptionsContainer>{showThemeToggle && <Toggle toggleTheme={toggleTheme} />}</OptionsContainer>
    </Wrapper>
  );
};
export default Topbar;
