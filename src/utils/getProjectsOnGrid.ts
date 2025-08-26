import { SchedulerData, SchedulerProjectData } from "@/types/global";
import { setProjectsInRows } from "./setProjectsInRows";

type ProjectsData = [projectsPerPerson: SchedulerProjectData[][][], rowsPerPerson: number[]];

export const projectsOnGrid = (data: SchedulerData) => {
  const initialProjectsData: ProjectsData = [[], []];
  const [projectsPerPerson, rowsPerPerson] = data.reduce((acc, curr) => {
    // Keep all tasks for rendering
    const projectsInRows = setProjectsInRows(curr.data);
    acc[0].push(projectsInRows);

    const nonRecurringTasks = curr.data.filter((task) => !task.id.includes("-recurring-"));
    acc[1].push(Math.max(nonRecurringTasks.length, 1));
    return acc;
  }, initialProjectsData);

  return { projectsPerPerson, rowsPerPerson };
};
