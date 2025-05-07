import React from "react";
import Scheduler from "../../src/components/Scheduler/Scheduler.tsx";
import { SchedulerData } from "../../src/types/global.ts";

const dummyData: SchedulerData = [
  {
    id: "row-1",
    label: { icon: "📁", title: "Project A", subtitle: "Phase 1" },
    data: [
      {
        id: "task-1",
        title: "Task 1",
        startDate: new Date("2025-05-01"),
        endDate: new Date("2025-05-03"),
        occupancy: 100
      },
      {
        id: "task-2",
        title: "Task 2",
        startDate: new Date("2025-05-04"),
        endDate: new Date("2025-05-06"),
        occupancy: 100,
        dependency: "task-1" // depends on Task 1
      }
    ]
  }
];

const main = () => {
  return (
    <div style={{ height: "100vh", padding: 20 }}>
      <Scheduler data={dummyData} />
    </div>
  );
};

export default main;
