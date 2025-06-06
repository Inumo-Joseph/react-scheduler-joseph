import dayjs from "dayjs";
import { SchedulerProjectData } from "@/types/global";

export const setProjectsInRows = (projects: SchedulerProjectData[]): SchedulerProjectData[][] => {
  const rows: SchedulerProjectData[][] = [];
  for (const project of projects) {
    let isAdded = false;
    if (rows.length) {
      for (const row of rows) {
        let isColliding = false;
        for (let i = 0; i < row.length; i++) {
          if (
            dayjs(project.startDate).isBetween(row[i].startDate, row[i].dueDate, null, "[]") ||
            dayjs(project.dueDate).isBetween(row[i].startDate, row[i].dueDate, null, "[]")
          ) {
            isColliding = true;
            break;
          }
          if (
            dayjs(project.startDate).isBefore(row[i].startDate, "day") &&
            dayjs(project.dueDate).isAfter(row[i].dueDate, "day")
          ) {
            isColliding = true;
            break;
          }
        }
        if (!isColliding) {
          row.push(project);
          isAdded = true;
          break;
        }
      }
    }
    if (!isAdded) {
      rows.push([project]);
    }
  }
  return rows;
};
