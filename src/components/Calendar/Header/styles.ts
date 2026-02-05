import styled from "styled-components";
import { headerHeight } from "@/constants";

export const StyledOuterWrapper = styled.span`
  background: ${({ theme }) => theme.colors.gridBackground};
  top: 0;
`;

export const StyledWrapper = styled.div`
  height: ${headerHeight}px;
  padding-top: 5px;
  background: ${({ theme }) => theme.colors.gridBackground};
  z-index: 1;
`;

export const StyledCanvas = styled.canvas``;
