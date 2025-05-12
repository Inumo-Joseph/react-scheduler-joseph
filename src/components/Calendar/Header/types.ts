export type HeaderProps = {
  zoom: number;
  topBarWidth: number;
  showThemeToggle?: boolean;
  toggleTheme?: () => void;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
};
