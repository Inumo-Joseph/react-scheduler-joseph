import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link, LinkIcon, PanelTopDashed, Trash2, UsersIcon } from "lucide-react";
import { StepTitle } from "semantic-ui-react";
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
    maxRecordsPerPage: 50,
    isFullscreen: true
  });

  const { peopleCount, projectsPerYear, yearsCovered, isFullscreen, maxRecordsPerPage } = values;

  const mocked = useMemo(
    () => createMockData(+peopleCount, +yearsCovered, +projectsPerYear),
    [peopleCount, projectsPerYear, yearsCovered]
  );

  const renderData = () => {
    return <div></div>;
  };

  const [isHidden, setIsHidden] = useState(false);

  const dummyData = [
    {
      id: "row-1",
      label: { icon: "📁", title: "Project A", subtitle: "Phase 1" },
      data: [
        {
          cardId: "row-1",
          id: "task-1",
          name: "Task 1",
          startDate: new Date("2025-06-01"),
          dueDate: new Date("2025-06-05"),
          occupancy: 100,
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-1",
          id: "task-2",
          name: "Task 2",
          startDate: new Date("2025-06-03"),
          dueDate: new Date("2025-06-10"),
          occupancy: 100,
          users: [],
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-1",
          id: "task-3",
          name: "Task 3",
          startDate: new Date("2025-06-07"),
          dueDate: new Date("2025-06-06"),
          occupancy: 100,
          parentTaskId: "task-2", // depends on Task 1
          users: ["Fran"],
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-1",
          id: "task-4",
          name: "Task 4",
          startDate: new Date("2025-06-10"),
          dueDate: new Date("2025-06-013"),
          occupancy: 100,
          users: ["Colby"],
          parentTaskId: "task-5",
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-1",
          id: "task-5",
          name: "Task 5",
          startDate: new Date("2025-06-10"),
          dueDate: new Date("2025-07-013"),
          occupancy: 100,
          isCompleted: false,
          isRecurring: false
        }
      ]
    },

    {
      id: "row-2",
      label: { icon: "📁", title: "Project B", subtitle: "Phase 1" },
      data: [
        {
          cardId: "row-2",
          id: "task-6",
          name: "  Emptying Locker",
          startDate: new Date("2025-05-28"),
          dueDate: new Date("2025-06-06"),
          occupancy: 100,
          parentTaskId: "task-7",
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-2",
          id: "task-7",
          name: "Task second shift",
          startDate: new Date("2025-06-03"),
          dueDate: new Date("2025-06-03"),
          occupancy: 100,
          users: ["Rob"],
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false,
          parentTaskId: "task-8"
        },
        {
          cardId: "row-2",
          id: "task-8",
          name: "Orlando Roster",
          startDate: new Date("2025-06-010"),
          dueDate: new Date("2025-06-017"),
          occupancy: 100,
          users: ["Fran"],
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-2",
          id: "task-9",
          name: "Task fourth Shift",
          startDate: new Date("2025-06-10"),
          dueDate: new Date("2025-06-013"),
          occupancy: 100,
          users: ["Colby"],
          parentTaskId: "task-3",
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-2",
          id: "task-10",
          name: "Task 5th shift",
          startDate: new Date("2025-06-6"),
          dueDate: new Date("2025-06-020"),
          occupancy: 100,
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false
        },
        {
          cardId: "row-2",
          id: "task-11",
          name: "Fix Flyer Codes",
          startDate: new Date("2025-06-10"),
          dueDate: new Date("2025-06-013"),
          occupancy: 100,
          users: ["Colby"],
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: true,
          isRecurring: false
        },
        {
          cardId: "row-2",
          id: "task-12",
          name: "Cancel Weekend Missions",
          startDate: new Date("2025-6-05"),
          dueDate: new Date("2025-06-010"),
          users: ["Dev"],
          occupancy: 100,
          bgColor: "rgba(133, 193, 233, 0.83)",
          isCompleted: false,
          isRecurring: false
        }
      ]
    }
  ];

  const renderPopup = () => {
    return (
      <div
        className="flex flex-col items-start "
        style={{ color: "white", display: "flex", flexDirection: "row" }}>
        <button
          style={{
            background: isHidden ? "#e04658" : "#038759",
            border: "3px solid white",
            color: "white",
            display: "flex",
            flexDirection: "row",
            padding: "2px",
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "0.6rem"
          }}
          onClick={() => {
            setIsHidden((prev) => {
              const newVal = !prev;
              return newVal;
            });
          }}>
          {isHidden ? "Undo" : "Done"}
        </button>
        <LinkIcon></LinkIcon>

        <Trash2></Trash2>
      </div>
    );
  };
  const [range, setRange] = useState<ParsedDatesRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: ParsedDatesRange) => {
    setRange(range);
  }, []);

  // const filteredData = useMemo(
  //   () =>
  //     dummyData.map((person) => ({
  //       ...person,
  //       data: person.data.filter(
  //         (project: any) =>
  //           dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
  //           dayjs(project.dueDate).isBetween(range.startDate, range.endDate) ||
  //           (dayjs(project.startDate).isBefore(range.startDate, "day") && dayjs(project.dueDate).isAfter(range.endDate, "day")))
  //     })),

  //   [mocked, range.endDate, range.startDate]
  // );

  console.log("Filtered Memo", dummyData);
  const handleFilterData = () => console.log(`Filters button was clicked.`);

  return (
    <>
      <ConfigPanel values={values} onSubmit={setValues} />
      {isFullscreen ? (
        <Scheduler
          startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
          onRangeChange={handleRangeChange}
          data={dummyData}
          isLoading={false}
          onFilterData={handleFilterData}
          renderData={renderData()}
          config={{ zoom: 1, maxRecordsPerPage: maxRecordsPerPage, showThemeToggle: false }}
          onItemClick={(data) => console.log("clicked: ", data)}
        />
      ) : (
        <StyledSchedulerFrame>
          <Scheduler
            startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
            onRangeChange={handleRangeChange}
            isLoading={false}
            data={dummyData}
            renderData={
              <div>
                <Link
                  className={"!w-3 !h-3 stroke-gray-400 hover:stroke-gray-500 cursor-pointer"}
                  stroke={"green"}
                />
              </div>
            }
            onFilterData={handleFilterData}
            onItemClick={(data) => console.log("clicked: ", data)}
          />
        </StyledSchedulerFrame>
      )}
    </>
  );
}

export default App;
