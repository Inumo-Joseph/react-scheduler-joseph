import styled, { createGlobalStyle, type DefaultTheme } from "styled-components";
import { css } from "styled-components";
import "./assets/font-awesome.css";

export const prefixId = "reactSchedulerOutsideWrapper";

export const GlobalStyle = createGlobalStyle`

  #${prefixId} {
    font-family: 'Proxima Nova','Arial', sans-serif;
    box-sizing: border-box;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    margin: 0;
  }

 #${prefixId} *,
 #${prefixId} *:before,
 #${prefixId} *:after {
    box-sizing: inherit;
    font-family: inherit;
    line-height: inherit;
  }
`;

export type ColorType =
  | "background"
  | "gridBackground"
  | "primary"
  | "secondary"
  | "tertiary"
  | "textPrimary"
  | "textSecondary"
  | "accent"
  | "disabled"
  | "border"
  | "placeholder"
  | "warning"
  | "button"
  | "tooltip"
  | "defaultTile"
  | "hover";

export type Theme = {
  colors: Record<ColorType, string>;
  navHeight: string;
  mode: "light" | "dark";
};

export const theme: DefaultTheme = {
  mode: "light",
  navHeight: "44px",
  colors: {
    background: "#FFFFFF",
    gridBackground: "#F5F5F5",

    primary: "#F8F8FD",
    secondary: "#E6F3FF",
    tertiary: "#C9E5FF",

    textPrimary: "#1C222F",
    textSecondary: "#FFFFFF",
    placeholder: "#607D8B",

    button: "#FFFFFF",
    border: "#D2D2D2",
    tooltip: "#FFFFFF",
    hover: "#E6F3FF",
    disabled: "#777777",
    warning: "#EF4444",

    defaultTile: "#728DE2",
    accent: "#5cb577"
  }
};

export const darkTheme: Theme = {
  mode: "dark",
  navHeight: "44px",
  colors: {
    background: "#161B22",
    gridBackground: "#1E252E",

    primary: "#303b49",
    secondary: "#444e5b",
    tertiary: "#6E757F",

    textPrimary: "#DADCE0",
    textSecondary: "#EAEBED",
    placeholder: "#bbbbbb",

    button: "#60676f",
    border: "#2C333A",
    hover: "#303439",
    tooltip: "#3B3C5F",
    disabled: "#38414a",
    warning: "#FF4C4C",

    defaultTile: "#728DE2",

    accent: "#1798c2"
  }
};

export const marginPaddingReset = `
margin: 0px;
padding: 0;
`;

export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledSchedulerFrame = styled.div`
  margin: 10rem 10rem;
  position: relative;
  width: 40vw;
  height: 40vh;
`;
