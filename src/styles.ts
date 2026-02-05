import styled, { createGlobalStyle, type DefaultTheme } from "styled-components";
import { css } from "styled-components";
import "./assets/font-awesome.css";

export const prefixId = "reactSchedulerOutsideWrapper";

export const GlobalStyle = createGlobalStyle`

  #${prefixId} {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
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
    gridBackground: "#FAFBFC",

    primary: "#F4F6F9",
    secondary: "#EBF2FF",
    tertiary: "#D6E4FF",

    textPrimary: "#1A1D23",
    textSecondary: "#FFFFFF",
    placeholder: "#8993A4",

    button: "#FFFFFF",
    border: "#E2E6ED",
    tooltip: "#FFFFFF",
    hover: "#F0F4FF",
    disabled: "#A0A8B4",
    warning: "#E5484D",

    defaultTile: "#6E7FF5",
    accent: "#34C759"
  }
};

export const darkTheme: Theme = {
  mode: "dark",
  navHeight: "44px",
  colors: {
    background: "#13161B",
    gridBackground: "#1A1E27",

    primary: "#242936",
    secondary: "#2D3548",
    tertiary: "#3D465A",

    textPrimary: "#E1E4EA",
    textSecondary: "#F0F1F3",
    placeholder: "#6B7280",

    button: "#2D3548",
    border: "#2A2F3C",
    hover: "#2D3548",
    tooltip: "#2D3548",
    disabled: "#3D465A",
    warning: "#E5484D",

    defaultTile: "#6E7FF5",

    accent: "#34C759"
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
