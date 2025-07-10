import { FC, useState } from "react";
import { useLanguage } from "@/context/LocaleProvider";
import Icon from "../Icon";
import PaginationButton from "../PaginationButton/PaginationButton";
import {
  StyledFloatingButtonWrapper,
  StyledInput,
  StyledInputWrapper,
  StyledLeftColumnHeader,
  StyledWrapper
} from "./styles";
import { LeftColumnProps } from "./types";
import LeftColumnItem from "./LeftColumnItem/LeftColumnItem";

const LeftColumn: FC<LeftColumnProps> = ({
  data,
  rows,
  onLoadNext,
  onLoadPrevious,
  pageNum,
  addTaskButton,
  pagesAmount,
  searchInputValue,
  onSearchInputChange,
  onItemClick
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { search } = useLanguage();

  const toggleFocus = () => setIsInputFocused((prev) => !prev);

  return (
    <StyledWrapper>
      <StyledLeftColumnHeader>
        <StyledInputWrapper isFocused={isInputFocused}>
          <StyledInput
            placeholder={search}
            value={searchInputValue}
            onChange={onSearchInputChange}
            onFocus={toggleFocus}
            onBlur={toggleFocus}
          />
          <Icon iconName="search" />
        </StyledInputWrapper>

        <StyledFloatingButtonWrapper>{addTaskButton}</StyledFloatingButtonWrapper>
      </StyledLeftColumnHeader>

      {data.map((item, index) => (
        <LeftColumnItem
          id={item.id}
          item={item.label}
          key={item.id}
          rows={rows[index]}
          onItemClick={onItemClick}
        />
      ))}

      <PaginationButton
        intent="next"
        isVisible={pageNum !== pagesAmount - 1}
        onClick={onLoadNext}
        icon={<Icon iconName="arrowDown" width="16" height="16" />}
        pageNum={pageNum}
        pagesAmount={pagesAmount}
      />
    </StyledWrapper>
  );
};

export default LeftColumn;
