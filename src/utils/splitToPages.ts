import {
  PaginatedSchedulerData,
  PaginatedSchedulerRow,
  SchedulerData,
  SchedulerProjectData
} from "@/types/global";

export const splitToPages = (
  data: SchedulerData,
  projectsPerPerson: SchedulerProjectData[][][],
  rowsPerPerson: number[],
  recordsThreshold: number
) => {
  const pages: PaginatedSchedulerData[] = [];

  const leftIndex = 0;
  const singlePage: PaginatedSchedulerRow[] = [];
  const pageRecords = 0;

  const totalTasks = rowsPerPerson.reduce((sum, personTasks) => sum + personTasks, 0);

  if (totalTasks <= recordsThreshold) {
    const singlePage: PaginatedSchedulerRow[] = [];
    projectsPerPerson.forEach((projects, i) => {
      const newItem = { id: data[i].id, label: data[i].label, data: projects };
      singlePage.push(newItem);
    });
    pages.push(singlePage);
    return pages;
  }

  let currentPage: PaginatedSchedulerRow[] = [];
  let currentPageTaskCount = 0;

  for (let i = 0; i < projectsPerPerson.length; i++) {
    const personTaskCount = rowsPerPerson[i];
    const personData = {
      id: data[i].id,
      label: data[i].label,
      data: projectsPerPerson[i]
    };

    if (currentPageTaskCount + personTaskCount > recordsThreshold && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentPageTaskCount = 0;
    }

    currentPage.push(personData);
    currentPageTaskCount += personTaskCount;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};
