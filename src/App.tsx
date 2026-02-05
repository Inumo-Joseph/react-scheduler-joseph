import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Calendar,
  Link,
  LinkIcon,
  PanelTopDashed,
  Trash2,
  UsersIcon,
  ArrowRightFromLineIcon
} from "lucide-react";
import {
  Button,
  Label,
  StepTitle,
  Popup,
  PopupContent,
  PopupHeader,
  Modal
} from "semantic-ui-react";
import { createMockData } from "./mock/appMock";
import { ParsedDatesRange } from "./utils/getDatesRange";
import { ConfigFormValues, SchedulerProjectData } from "./types/global";
import ConfigPanel from "./components/ConfigPanel";
import { StyledSchedulerFrame } from "./styles";
import { StyledTooltipWrapper } from "./components/Tooltip/styles";
import { Scheduler } from ".";

function App() {
  const [values, setValues] = useState<ConfigFormValues>({
    peopleCount: 15,
    projectsPerYear: 5,
    yearsCovered: 0,
    startDate: undefined,
    maxRecordsPerPage: 30,
    isFullscreen: false
  });

  const { isFullscreen, maxRecordsPerPage } = values;

  // Today's date: 2026-02-02
  const today = new Date();
  const dummyData = [
    {
      id: "card-1",
      label: { icon: "📁", title: "Marketing Campaign", subtitle: "Q1 Launch" },
      data: [
        // Parent task - Campaign Planning (no parent)
        {
          cardId: "card-1",
          id: "task-1",
          name: "Campaign Planning",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
          occupancy: 100,
          users: ["Alice"],
          bgColor: "#4CAF50",
          isCompleted: false,
          isRecurring: false
        },
        // Child of task-1
        {
          cardId: "card-1",
          id: "task-2",
          name: "Design Assets",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
          occupancy: 100,
          users: ["Bob"],
          bgColor: "#2196F3",
          isCompleted: false,
          isRecurring: false,
          parentTaskId: "task-1"
        },
        // Recurring task - Weekly standup
        {
          cardId: "card-1",
          id: "task-3",
          name: "Weekly Standup",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
          occupancy: 100,
          users: ["Team"],
          bgColor: "#FF9800",
          isCompleted: false,
          isRecurring: true,
          recurring: "weekly"
        },
        // Child of task-2
        {
          cardId: "card-1",
          id: "task-4",
          name: "Review Designs",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
          occupancy: 100,
          users: ["Carol"],
          bgColor: "#9C27B0",
          isCompleted: false,
          isRecurring: false,
          parentTaskId: "task-2"
        },
        // Standalone task
        {
          cardId: "card-1",
          id: "task-5",
          name: "Content Writing",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
          occupancy: 100,
          users: ["Diana"],
          bgColor: "#E91E63",
          isCompleted: false,
          isRecurring: false
        }
      ]
    },
    {
      id: "card-2",
      label: { icon: "🚀", title: "Product Development", subtitle: "Sprint 12" },
      data: [
        // Parent task - Feature Development
        {
          cardId: "card-2",
          id: "task-6",
          name: "Feature Development",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 16),
          occupancy: 100,
          users: ["Erik"],
          bgColor: "#00BCD4",
          isCompleted: false,
          isRecurring: false,
                    parentTaskId: "task-7"

        },
        // Child of task-6
        {
          cardId: "card-2",
          id: "task-7",
          name: "Unit Testing",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18),
          occupancy: 100,
          users: ["Frank"],
          bgColor: "#795548",
          isCompleted: true,
          isRecurring: false,
        },
        // Recurring task - Daily sync
        {
          cardId: "card-2",
          id: "task-8",
          name: "Daily Sync",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()-1),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          occupancy: 100,
          users: ["Team"],
          bgColor: "#607D8B",
          isCompleted: false,
          isRecurring: true,
          recurring: "daily"
        },
        // Standalone completed task
        {
          cardId: "card-2",
          id: "task-9",
          name: "Documentation",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9),
          occupancy: 100,
          users: ["Grace"],
          bgColor: "#3F51B5",
          isCompleted: true,
          isRecurring: false
        },
        // Child of task-7 (grandchild of task-6)
        {
          cardId: "card-2",
          id: "task-10",
          name: "Code Review",
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          occupancy: 100,
          users: ["Henry"],
          bgColor: "#F44336",
          isCompleted: false,
          isRecurring: false,
          parentTaskId: "task-7"
        }
      ]
    }
  ];

  const onAssignTask = (taskId: any, updatedTask: any, flag = null) => {
    if (flag) {
      alert(`${flag}`);
    }

    dummyData.flatMap((row) =>
      row.data.flatMap((task) => {
        if (task.id === updatedTask.id) {
          task = updatedTask;
        }
      })
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [range, setRange] = useState<ParsedDatesRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: ParsedDatesRange) => {
    setRange(range);
  }, []);
  console.log("Data in App", dummyData)
  const handleFilterData = () => console.log(`Filters button was clicked.`);
  const [schedulerZoom, setSchedulerZoom] = useState<any>("1");
  const [truncateText, setTruncateText] = useState<boolean>();
  const [showChecked, setShowChecked] = useState<boolean>();
  const [todayClicked, setTodayClicked] = useState(false);
  const [schedulerSize, setSchedulerSize] = useState<any>(1);
  const [addTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>();
  const [selectedCard, setSelectedCard] = useState<any>();
  const [clickedTask, setClickedTask] = useState<any>(null);
  const taskInteractionProps = useMemo(
    () => ({
      setMousePosition,
      setSelectedDate,
      setShowAddTaskModal,
      setSelectedCard
    }),
    [setMousePosition, setSelectedDate, setShowAddTaskModal, setSelectedCard]
  );

  const handleGoTodayClick = () => {
    setTodayClicked((prev) => !prev);
  };

  
  if (selectedDate || addTaskModal) {
    // return (
    //   <Popup.Header>
    //     ADD TASK
    //     <Popup.Content>
    //       {selectedDate?.toDateString()}
    //       {`At position ${mousePosition?.x} : ${mousePosition?.y}`}
    //       {`AND with card, ${selectedCard}`}
    //     </Popup.Content>
    //   </Popup.Header>
    // );
    // alert(
    //   `Adding Task t at POS: ${mousePosition?.x}: ${mousePosition?.y} with $\n  ${selectedCard} during ${selectedDate}`
    // );
    //  console.log(`Set selected Date ${selectedDate}`)
  }

  // if (clickedTask) {
  //   alert(`task deleted ${clickedTask.name}`);
  //   setClickedTask(null);
  // }

  return (
    <>
      <div style={{ paddingLeft: "300px" }}>
        <Button>
          {" "}
          <div
            onClick={() => {
              handleGoTodayClick();
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center", // vertical alignment
                justifyContent: "center", // horizontal centering
                gap: "5px" // spacing between items
              }}>
              <Calendar />
              Today
            </div>
          </div>
        </Button>{" "}
        <Button>
          <select
            name="select"
            value={schedulerZoom}
            onChange={(e) => setSchedulerZoom(e.target.value)}>
            <option value=""> DAYS, WEEKS, QUARTERS, YEAR </option>
            <option value={"1"}> DAYS</option>
            <option value={"0"}> WEEKS </option>
            <option value={"3"}> MONTHS </option>
          </select>
        </Button>
        <Button onClick={() => setTruncateText(false)}> ---| </Button>
        <Button onClick={() => setTruncateText(true)}>
          <ArrowRightFromLineIcon></ArrowRightFromLineIcon>
        </Button>
        <Button
          onClick={() => {
            setShowChecked(!showChecked);
          }}>
          {" "}
          Show/Hide Checked Items{" "}
        </Button>
        <Button>
          {" "}
          Zoom
          <select
            name="select"
            value={schedulerSize}
            onChange={(e) => {
              setSchedulerSize(e.target.value);
            }}>
            <option value={1}> 0% </option>
            <option value={1.1}> 50% </option>
            <option value={1.2}> 75% </option>
            <option value={1.3}> 100% </option>
          </select>
        </Button>
      </div>

      <ConfigPanel values={values} onSubmit={setValues} />

      {isFullscreen ? (
        <Scheduler
          startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
          onRangeChange={handleRangeChange}
          data={dummyData}
          isLoading={false}
          onFilterData={handleFilterData}
          renderData={
            <div>
              <button>
                <Trash2 />
              </button>
            </div>
          }
          config={{
            zoom: schedulerZoom,
            maxRecordsPerPage: maxRecordsPerPage,
            showThemeToggle: false
          }}
          onItemClick={(data) => console.log("clicked: ", data)}
          onAssignTask={onAssignTask}
          schedulerZoom={schedulerZoom}
          schedulerTruncate={truncateText}
          hideCheckedItems={showChecked}
          addTaskButton={
            <div>
              <button onClick={() => console.log("button clicked")}>ADD TASK</button>
            </div>
          }
          todayClicked={todayClicked}
          setClickedTask={setClickedTask}
          schedulerSize={schedulerSize}
          taskInteractionProps={taskInteractionProps}
        />
      ) : (
        <StyledSchedulerFrame>
          <Scheduler
            startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
            onRangeChange={handleRangeChange}
            isLoading={false}
            data={dummyData}
            onFilterData={handleFilterData}
            schedulerZoom={schedulerZoom}
            schedulerTruncate={truncateText}
            config={{
              zoom: schedulerZoom,
              maxRecordsPerPage: maxRecordsPerPage,
              showThemeToggle: false
            }}
            hideCheckedItems={showChecked}
            onItemClick={(data) => console.log("clicked: ", data)}
            onAssignTask={onAssignTask}
            todayClicked={todayClicked}
            addTaskButton={
              <div>
                <button onClick={() => console.log("button clicked")}>ADD TASK</button>
              </div>
            }
            renderData={
              <div>
                <button>
                  <Trash2 />
                </button>
              </div>
            }
            schedulerSize={schedulerSize}
            setClickedTask={setClickedTask}
            taskInteractionProps={taskInteractionProps}
          />
        </StyledSchedulerFrame>
      )}
    </>
  );
}

export default App;
