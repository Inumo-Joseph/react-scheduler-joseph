import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
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

  const [isHidden, setIsHidden] = useState(false);

  const renderData = () => {
    return (
      <StyledTooltipWrapper>
        <div
          className="flex flex-col items-start "
          style={{ color: "white", display: "flex", flexDirection: "row" }}>
          <button
            style={{
              margin: "4px",
              background: isHidden ? "#e04658" : "#038759",
              border: "2px solid white",
              color: "white",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "0.6rem"
            }}
            onClick={() => {
              setIsHidden((prev) => {
                const newVal = !prev;
                console.log("isHidden will be:", newVal);
                return newVal;
              });
            }}>
            {isHidden ? "Undo" : "Done"}
          </button>
        </div>
      </StyledTooltipWrapper>
    );
  };

  const dummyData = [
    {
      id: "row-1",
      label: { icon: "📁", title: "Project A", subtitle: "Phase 1" },
      data: [
        {
          id: "task-1",
          title: "Task 1",
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
          occupancy: 100,
          dependency: "task-2"
        },
        {
          id: "task-2",
          title: "Task 2",
          startDate: new Date("2025-05-03"),
          endDate: new Date("2025-05-06"),
          occupancy: 100,
          users: []
        },
        {
          id: "task-3",
          title: "Task 3",
          startDate: new Date("2025-05-07"),
          endDate: new Date("2025-05-010"),
          occupancy: 100,
          dependency: "task-2", // depends on Task 1
          users: ["Fran"]
        },
        {
          id: "task-4",
          title: "Task 4",
          startDate: new Date("2025-05-10"),
          endDate: new Date("2025-05-013"),
          occupancy: 100,
          users: ["Colby"],
          dependency: "task-5"
        },
        {
          id: "task-5",
          title: "Task 5",
          startDate: new Date("2025-05-10"),
          endDate: new Date("2025-06-013"),
          occupancy: 100
        }
      ]
    },

    {
      id: "row-2",
      label: { icon: "📁", title: "Project B", subtitle: "Phase 1" },
      data: [
        {
          id: "task-6",
          title: "  Emptying Locker",
          startDate: new Date("2025-05-01"),
          endDate: new Date("2025-05-03"),
          occupancy: 100
        },
        {
          id: "task-7",
          title: "Task second shift",
          startDate: new Date("2025-05-03"),
          endDate: new Date("2025-05-06"),
          occupancy: 100,
          users: []
        },
        {
          id: "task-8",
          title: "Orlando Roster",
          startDate: new Date("2025-05-07"),
          endDate: new Date("2025-05-010"),
          occupancy: 100,
          users: ["Fran"]
        },
        {
          id: "task-9",
          title: "Task fourth Shift",
          startDate: new Date("2025-05-10"),
          endDate: new Date("2025-05-013"),
          occupancy: 100,
          users: ["Colby"]
        },
        {
          id: "task-10",
          title: "Task fifth shift",
          startDate: new Date("2025-05-10"),
          endDate: new Date("2025-06-013"),
          occupancy: 100
        }
      ]
    }
  ];

  const [range, setRange] = useState<ParsedDatesRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: ParsedDatesRange) => {
    setRange(range);
  }, []);

  const filteredData = useMemo(
    () =>
      dummyData.map((person) => ({
        ...person,
        data: person.data.filter(
          (project) =>
            dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
            dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
            (dayjs(project.startDate).isBefore(range.startDate, "day") &&
              dayjs(project.endDate).isAfter(range.endDate, "day"))
        )
      })),
    [mocked, range.endDate, range.startDate]
  );

  const handleFilterData = () => console.log(`Filters button was clicked.`);

  const handleTileClick = (data: SchedulerProjectData) =>
    console.log(
      `Item ${data.title} - ${data.subtitle} was clicked. \n==============\nStart date: ${data.startDate} \n==============\nEnd date: ${data.endDate}\n==============\nOccupancy: ${data.occupancy}`
    );
  const handleTileHover = (data: SchedulerProjectData) => {
    console.log("Hovered tile:", data.title);
    // Use this to set tooltip data or do anything else
  };

  return (
    <>
      <ConfigPanel values={values} onSubmit={setValues} />
      {isFullscreen ? (
        <Scheduler
          startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
          onRangeChange={handleRangeChange}
          data={filteredData}
          isLoading={false}
          onFilterData={handleFilterData}
          config={{ zoom: 1, maxRecordsPerPage: maxRecordsPerPage, showThemeToggle: false }}
          onItemClick={(data) => console.log("clicked: ", data)}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
        />
      ) : (
        <StyledSchedulerFrame>
          <Scheduler
            startDate={values.startDate ? new Date(values.startDate).toISOString() : undefined}
            onRangeChange={handleRangeChange}
            isLoading={false}
            data={filteredData}
            renderData={renderData()}
            onFilterData={handleFilterData}
            onItemClick={(data) => console.log("clicked: ", data)}
            isHidden={isHidden}
            setIsHidden={setIsHidden}
          />
        </StyledSchedulerFrame>
      )}
    </>
  );
}

export default App;
