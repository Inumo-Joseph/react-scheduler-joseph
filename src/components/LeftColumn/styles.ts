import styled from "styled-components";
import { leftColumnWidth } from "@/constants";
import { StyledInputWrapperProps } from "./types";

export const StyledWrapper = styled.div`
  min-width: ${leftColumnWidth + "px"};
  max-width: ${leftColumnWidth + "px"};
  min-height: 50vh;
  position: sticky;
  left: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 2;
`;

export const StyledLeftColumnHeader = styled.div`
  padding-bottom: 4px;
  position: sticky;
  padding-right: 8px;
  padding-left: 8px;

  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: ${leftColumnWidth}px;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 3;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledInput = styled.input`
  height: 100%;
  width: calc(100% - 44px);
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 0 7px 10px;
  border: 0;
  outline: none;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.2px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
    font-weight: 400;
  }
`;

export const StyledInputWrapper = styled.div<StyledInputWrapperProps>`
  margin-top: 8px;
  height: 30px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid
    ${({ theme, isFocused }) => (isFocused ? theme.colors.accent : theme.colors.border)};
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  ${({ isFocused, theme }) =>
    isFocused &&
    `box-shadow: 0 0 0 2px ${theme.colors.accent}33;`}

  svg {
    margin-left: auto;
    margin-right: 10px;
    height: 16px;
    width: 16px;
    opacity: 0.5;
  }
`;
