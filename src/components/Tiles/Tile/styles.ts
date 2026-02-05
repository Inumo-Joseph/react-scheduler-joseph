import styled from "styled-components";
import { leftColumnWidth, tileHeight } from "@/constants";
import { marginPaddingReset, truncate } from "@/styles";
import { StyledTextProps } from "./types";

export const StyledTileWrapper = styled.div`
  display: inline;

  position: absolute;
  height: ${tileHeight}px;
  border-radius: 8px;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.08s ease, transform 0.08s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

export const StyledTextWrapper = styled.div`
  margin: 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 100%;
  letter-spacing: 0.2px;
  line-height: 1.3;
  font-size: 12px;
  font-weight: 500;
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
        left: ${leftColumnWidth + 10}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}
`;
