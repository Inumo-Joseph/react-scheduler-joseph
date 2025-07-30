import styled from "styled-components";
import { leftColumnWidth, tileHeight } from "@/constants";
import { marginPaddingReset, truncate } from "@/styles";
import { StyledTextProps } from "./types";

export const StyledTileWrapper = styled.div`
  ${marginPaddingReset}
  height: ${tileHeight}px;
  position: absolute;
  border: none;
  border-radius: 5px;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;
`;

export const StyledTextWrapper = styled.div`
  margin: 2px;
  display: flex;
  letter-spacing: 0.5px;
  line-height: 12px;
`;

export const StyledText = styled.p<StyledTextProps>`
  ${marginPaddingReset}

  display: inline;
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
  position: sticky;
  left: ${leftColumnWidth + 50}px;
  ${({ $allowOverflow }) =>
    !$allowOverflow &&
    `
    overflow: hidden;
    white-space: nowrap;
    textOverflow: ellipsis;  

  `}
`;
