import styled from "styled-components";
import { headerHeight } from "@/constants";

export const StyledOuterWrapper = styled.div`
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const StyledWrapper = styled.div`
  height: ${headerHeight}px;
  padding-top: 5px
  display: block;
`;

export const StyledCanvas = styled.canvas``;
