import { Dispatch, Ref } from "react";
import { AnyAction } from "redux";
import { DragEndEvent } from "@dnd-kit/core";
import { SchedulerData, SchedulerProjectData } from "@/types/global";

type AddParentChildTaskProps = {
  anotherTrigger?: boolean;
  updateTaskMode?: boolean;
  form: any;
  task: any;
  selectedParentTask: any;
  onAssignTask?: React.ReactNode;
  onCreateTask?: React.ReactNode;
  setPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

type UsersProps = {
  updateTaskMode?: boolean;
  form: any;
  task: any;
  setPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
  taskDueDate?: Date;
  setSelectedTask?: any;
  selectedParentTask?: any;
  setPopupOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type TileProps = {
  row: number;
  data: SchedulerProjectData;
  zoom: number;
  renderData: React.ReactNode;
  tasks?: any;
  parentChildTask?: (props: AddParentChildTaskProps) => React.ReactNode;
  alarmClock?: (props: AlarmClockProps) => React.ReactNode;
  Users?: (props: UsersProps) => React.ReactNode;
  reccuringIcon?: React.ReactNode;
  hideCheckedItems?: any;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  isDraggingGlobal?: boolean;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: SchedulerData;
  tileRef?: React.RefObject<HTMLButtonElement>;
  onHover?: React.ReactNode;
  onAssignTask?: (task: any, updatedTask: any, flag: any) => void;
  form?: any;
  tilePositions?: Record<string, { x: number; y: number; width: number; height: number }>;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  setClickedTask?: React.Dispatch<React.SetStateAction<any>>;
};

export type StyledTextProps = {
  bold?: boolean;
  $allowOverflow?: boolean; // Add this if you want to use it on StyledText too
};
