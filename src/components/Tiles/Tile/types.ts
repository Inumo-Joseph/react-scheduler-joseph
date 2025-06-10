import { Dispatch, Ref } from "react";
import { AnyAction } from "redux";
import { SchedulerData, SchedulerProjectData } from "@/types/global";

type AddParentChildTaskProps = {
  anotherTrigger?: boolean;
  updateTaskMode?: () => void;
  form: any;
  task: any;
  selectedParentTask: any;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions: any;
};

type AlarmClockProps = {
  form: any;
  isRecurringSelected: boolean;
  addTaskMonth: Date | undefined;
  setAddTaskMonth: (month: Date) => void;
  addTaskDate: Date | undefined;
  setAddTaskDate: (date: Date | undefined) => void;
  alarmClockTriger?: boolean;
  updateTaskMode?: boolean;
  task?: any;
  onCalendarUpdate?: (data: any) => void;
  taskDueDate?: any;
  setSelectedTask?: any;
  selectedParentTask?: any;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions: any;
};
export type TileProps = {
  row: number;
  data: SchedulerProjectData;
  zoom: number;
  renderData: React.ReactNode;
  tasks?: any;
  parentChildTask?: (props: AddParentChildTaskProps) => React.ReactNode;
  alarmClock?: (props: AlarmClockProps) => React.ReactNode;
  Users?: any;
  hideCheckedItems?: any;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: SchedulerData;
  tileRef?: React.RefObject<HTMLButtonElement>;
  onHover?: React.ReactNode;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions?: any;
  form?: any;
  tilePositions?: Record<string, { x: number; y: number; width: number; height: number }>;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
};

export type StyledTextProps = {
  bold?: boolean;
  truncateText?: boolean;
};
