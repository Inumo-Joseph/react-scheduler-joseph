import { PaginatedSchedulerData } from "@/types/global";

export const getTotalRowsPerPage = (page: PaginatedSchedulerData) => {
  return page
    ? page
        .flatMap((page) =>
          page.data
            .flatMap((projects) => projects.length)
            .reduce((acc, curr) => acc + Math.max(curr, 1), 0)
        )
        .reduce((acc, curr) => acc + curr)
    : 0;
};
