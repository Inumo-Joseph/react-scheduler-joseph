export type TopbarProps = {
  width: number;
  showThemeToggle?: boolean;
  toggleTheme?: () => void;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
};
