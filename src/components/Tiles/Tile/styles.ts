import styled from "styled-components";
import { leftColumnWidth, tileHeight } from "@/constants";
import { marginPaddingReset, truncate } from "@/styles";
import { StyledTextProps } from "./types";

export const StyledTileWrapper = styled.div`
  display: inline;

  position: absolute;
  height: ${tileHeight}px;
  border: 1px;
  border-radius: 5px;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const StyledTextWrapper = styled.div`
  margin: 2px;
  display: flex;
  letter-spacing: 0.5px;
  line-height: 12px;
`;

export const StyledText = styled.p<StyledTextProps>`
  ${marginPaddingReset}

  font-weight: ${({ bold }) => (bold ? "600" : "400")};
  &:first-child {
    &::after {
      margin: 0px 2px;
    }
  }
`;

export const StyledDescription = styled.p<{ $allowOverflow?: boolean }>`
  ${marginPaddingReset}
  ${({ $allowOverflow }) => !$allowOverflow && truncate}
`;

export const StyledStickyWrapper = styled.div<{ $allowOverflow?: boolean }>`
  ${({ $allowOverflow }) =>
    $allowOverflow
      ? `
        position: relative; 
        overflow: visible;
        white-space: nowrap;
        min-width: max-content;
      `
      : `
        position: sticky;
        left: ${leftColumnWidth + 50}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}
`;
