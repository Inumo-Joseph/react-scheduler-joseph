export const getStatus = (task: any) => {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const twelveHours = 12 * 60 * 60 * 1000;
  const twentyFourHours = 24 * 60 * 60 * 1000;

  let status = "default";

  if (task.isCompleted) {
    status = "completed";
  } else if (now.getTime() > dueDate.getTime()) {
    status = "overdue";
  } else if (dueDate.getTime() - now.getTime() < twelveHours) {
    status = "lessThan12Hours";
  } else if (dueDate.getTime() - now.getTime() < twentyFourHours) {
    status = "between12And24Hours";
  }

  switch (status) {
    case "completed":
      return { background: "#038759", text: "white" };
    case "overdue":
    case "lessThan12Hours":
      return { background: "#EE4360", text: "white" };
    case "between12And24Hours":
      return { background: "#FFCC00", text: "white" };
    default:
      return { background: "#AEAFC7", text: "white" };
  }
};
