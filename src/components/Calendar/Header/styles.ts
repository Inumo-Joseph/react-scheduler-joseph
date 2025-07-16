import styled from "styled-components";
import { headerHeight } from "@/constants";

export const StyledOuterWrapper = styled.div`
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const StyledWrapper = styled.div`
  height: ${headerHeight}px;
  padding-top: 5px
  display: block;
  
  background: #F5F5F5;
`;

export const StyledCanvas = styled.canvas``;
