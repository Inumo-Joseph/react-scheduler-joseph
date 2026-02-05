import { Dispatch, FC, memo, SetStateAction } from "react";
import { SchedulerProjectData } from "@/types/global";
import { getStatus } from "@/utils/getStatus";

interface TilePopupContentProps {
  data: SchedulerProjectData;
  isCompleted: boolean;
  onTaskToggle: () => void;
  parentChildTask?: (props: {
    task: SchedulerProjectData;
    selectedParentTask: null;
    updateTaskMode: boolean;
    form: undefined;
  }) => React.ReactNode;
  reccuringIcon?: React.ReactNode;
  alarmClock?: (props: {
    form: unknown;
    task: SchedulerProjectData;
    setAddTaskMonth: (month: Date) => void;
    setAddTaskDate: (date: Date | undefined) => void;
    isRecurringSelected: boolean;
    taskDueDate: Date;
    setSelectedTask: Dispatch<SetStateAction<SchedulerProjectData | null>>;
    addTaskMonth: Date | undefined;
    addTaskDate: Date | undefined;
  }) => React.ReactNode;
  Users?: (props: { form: unknown; task: SchedulerProjectData }) => React.ReactNode;
  form: unknown;
  addTaskMonth: Date | undefined;
  addTaskDate: Date | undefined;
  setAddTaskMonth: (month: Date) => void;
  setAddTaskDate: (date: Date | undefined) => void;
  setSelectedTask: Dispatch<SetStateAction<SchedulerProjectData | null>>;
}

const TilePopupContent: FC<TilePopupContentProps> = memo(
  ({
    data,
    isCompleted,
    onTaskToggle,
    parentChildTask,
    reccuringIcon,
    alarmClock,
    Users,
    form,
    addTaskMonth,
    addTaskDate,
    setAddTaskMonth,
    setAddTaskDate,
    setSelectedTask
  }) => {
    const isRecurringSelected = data?.isRecurring || false;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          color: "white"
        }}>
        <button
          style={{
            background: isCompleted ? "#E5484D" : "#34C759",
            border: "none",
            color: "white",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "4px 8px",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.3px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            transition: "opacity 0.15s ease"
          }}
          onClick={onTaskToggle}>
          {isCompleted ? "Undo" : "Done"}
        </button>

        <div style={{ color: "black" }}>
          {parentChildTask?.({
            task: data,
            selectedParentTask: null,
            updateTaskMode: true,
            form: undefined
          })}
        </div>

        {data.recurring && (
          <div
            className="relative flex text-[white] w-[40px] h-[21px] px-1 items-center justify-between rounded-[4px]"
            style={{ backgroundColor: getStatus(data).background }}>
            {reccuringIcon}
            <p>{data.recurring?.[0].toUpperCase()}</p>
          </div>
        )}

        {alarmClock?.({
          form: form,
          task: data,
          setAddTaskMonth: setAddTaskMonth,
          setAddTaskDate: setAddTaskDate,
          isRecurringSelected: isRecurringSelected,
          taskDueDate: data.dueDate,
          setSelectedTask: setSelectedTask,
          addTaskMonth: addTaskMonth,
          addTaskDate: addTaskDate
        })}

        {Users?.({
          form: form,
          task: data
        })}
      </div>
    );
  }
);

TilePopupContent.displayName = "TilePopupContent";

export default TilePopupContent;
