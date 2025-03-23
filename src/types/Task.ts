import {
  faCheckDouble,
  faClock,
  faList,
  faPause,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// Define task status types
export type TaskStatus =
  | "todo"
  | "in-progress"
  | "postponed"
  | "done"
  | "closed";

export const TaskDefaultConfig = {
  status: "todo",
  priority: "medium",
};

// Define the Task interface
export interface Task {
  id: string;
  text: string;
  link?: string;
  completed: boolean;
  date: string;
  status: TaskStatus;
  description?: string;
  priority?: "low" | "medium" | "high";
}

// Define view types
export type ViewType = "board" | "timeline";

// Styles object to replace inline styles
export const styles = {
  heroBody: { alignItems: "baseline" as const },
  fieldHorizontal: { marginBottom: "2%" },
  fieldAddons: { justifyContent: "center" },
  controlInput: { width: "55%" },
  linkInput: { width: "100%" },
  dateInput: { width: "16.8%" },
  taskList: {
    maxHeight: "calc(100vh - 400px)",
    overflowY: "scroll" as const,
  },
  deleteButton: { marginRight: "0px" },
  completedTask: {
    textDecoration: "line-through",
    color: "#888",
    fontStyle: "italic",
  },
  taskDate: {
    fontSize: "0.8rem",
    color: "#666",
    marginLeft: "5px",
  },
  boardContainer: {
    display: "flex",
    overflowX: "auto" as const,
    padding: "10px 0",
    gap: "15px",
  },
  statusColumn: {
    minWidth: "280px",
    background: "#f5f5f5",
    borderRadius: "5px",
    padding: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  columnHeader: {
    padding: "10px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskCard: {
    background: "white",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "grab",
    transition: "all 0.2s ease",
  },
  priorityHigh: {
    borderLeft: "4px solid #ff3860",
  },
  priorityMedium: {
    borderLeft: "4px solid #ffdd57",
  },
  priorityLow: {
    borderLeft: "4px solid #48c774",
  },
  viewSelector: {
    marginBottom: "15px",
  },
  statusIcon: {
    marginRight: "5px",
  },
};

// Status configuration
export const statusConfig = {
  todo: {
    label: "To Do",
    action: "To Do",
    icon: faList,
    color: "#3e8ed0",
  },
  "in-progress": {
    label: "In Progress",
    action: "In Progress",
    icon: faClock,
    color: "#48c774",
  },
  postponed: {
    label: "Postponed",
    action: "Postpone",
    icon: faPause,
    color: "#ffdd57",
  },
  done: {
    label: "Done",
    action: "Done",
    icon: faCheckDouble,
    color: "#00d1b2",
  },
  closed: {
    label: "Closed",
    action: "Close",
    icon: faTimes,
    color: "#f14668",
  },
  deleted: {
    label: "Deleted",
    action: "Delete",
    icon: faTrash,
    color: "#f14668",
  },
};

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
