import styled from "styled-components";
import { marginPaddingReset } from "@/styles";
import { PaginationButtonProps, StyledPaginationButton } from "./types";

export const StyledWrapper = styled.div<Pick<PaginationButtonProps, "intent">>`
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
`;

export const StyledButton = styled.button<StyledPaginationButton>`
  margin-top: 0px;
  padding: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.placeholder};
  border-radius: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.placeholder};
  line-height: 140%;
  letter-spacing: 1px;
  cursor: pointer;
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  pointer-events: ${({ isVisible }) => (isVisible ? "auto" : "none")};
  &:hover {
    transition: 0.5s ease;
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledText = styled.p`
  ${marginPaddingReset}
  width: 100%;
  text-align: center;
`;
