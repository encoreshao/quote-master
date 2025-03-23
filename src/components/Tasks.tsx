/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState } from "react";
import { useFormContext } from "../contexts/FormContext";
import { setStorage } from "../utils";
import {
  faTasks,
  faCalendarAlt,
  faCheck,
  faList,
  faFilter,
  faClock,
  faPause,
  faCheckDouble,
  faTimes,
  faTrash,
  faLink,
  faEdit,
  faGear,
  faAngleUp,
  faAngleDown,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// NOTE: To enable drag and drop functionality, install the following package:
// npm install react-beautiful-dnd

// Define task status types
type TaskStatus = "todo" | "in-progress" | "postponed" | "done" | "closed";

// Define the Task interface
interface Task {
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
type ViewType = "board" | "timeline";

// Styles object to replace inline styles
const styles = {
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
const statusConfig = {
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
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// TaskInput component for adding or editing tasks
const TaskInput = ({
  onAddTask,
  editingTask,
  onCancelEdit,
}: {
  onAddTask: (task: Task) => void;
  editingTask?: Task;
  onCancelEdit?: () => void;
}) => {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const autoFillinTask = (editingTask: Task) => {
    if (editingTask) {
      setInput(editingTask.text);
      setDate(editingTask.date);
      setLink(editingTask.link || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");

      setShowAdvanced(true); // Show advanced options when editing
    }
  };

  // Set form values when editingTask changes
  useState(() => {
    editingTask && autoFillinTask(editingTask);
  });

  // Set form values when editingTask changes
  useEffect(() => {
    editingTask && autoFillinTask(editingTask);
  }, [editingTask]);

  const handleAddOrUpdateTask = () => {
    if (input.trim()) {
      onAddTask({
        id: editingTask ? editingTask.id : generateId(),
        text: input.trim(),
        link: link.trim() || undefined,
        completed: editingTask ? editingTask.completed : false,
        date: date || new Date().toISOString().split("T")[0],
        status: editingTask ? editingTask.status : "todo",
        description: description.trim() || undefined,
        priority,
      });

      // Reset form
      setInput("");
      setLink("");
      setDate("");
      setDescription("");
      setPriority("medium");
      setShowAdvanced(false);
    }
  };

  const handleCancel = () => {
    // Reset form and cancel edit
    setInput("");
    setLink("");
    setDate("");
    setDescription("");
    setPriority("medium");
    setShowAdvanced(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="box">
      <div className="field" style={styles.fieldAddons}>
        <div className="field is-grouped">
          <div className="control has-icons-left" style={styles.controlInput}>
            <input
              className="input is-focused is-link"
              type="text"
              placeholder="Add a new task..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleAddOrUpdateTask()
              }
              value={input}
            />
            <span className="icon is-medium is-left">
              <FontAwesomeIcon icon={faTasks} fontSize="15" />
            </span>
          </div>

          <div className="control has-icons-left" style={styles.dateInput}>
            <input
              className="input is-link"
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
          </div>

          <div className="control">
            <button className="button is-link" onClick={handleAddOrUpdateTask}>
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>

          {editingTask && (
            <div className="control">
              <button className="button is-light" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}

          <div className="control">
            <button
              className="button is-light"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <FontAwesomeIcon
                icon={showAdvanced ? faAngleDown : faAngleUp}
                className="m-1"
              />
            </button>
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="field mt-3">
          <div
            className="control has-icons-left with-link"
            style={styles.linkInput}
          >
            <input
              className="input is-focused is-link float-right"
              type="text"
              placeholder="Add a new task link..."
              onChange={(e) => setLink(e.target.value)}
              value={link}
            />
            <span className="icon is-medium is-left">
              <FontAwesomeIcon icon={faLink} fontSize="15" />
            </span>
          </div>

          <div className="field">
            <label className="label"></label>
            <div className="control">
              <textarea
                className="textarea is-link"
                placeholder="Add more details about this task..."
                value={description}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div
              className="field-label is-normal"
              style={{ flexGrow: "inherit" }}
            >
              <label className="label">Priority</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div
                  className="select is-link is-fullwidth"
                  style={{ width: "20%" }}
                >
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "low" | "medium" | "high")
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// TaskItem component for individual task items
const TaskItem = ({
  task,
  viewType,
  onRemove,
  onUpdateStatus,
  onEdit,
  dragHandleProps = {},
}: {
  task: Task;
  index: number;
  viewType: string;
  onRemove: () => void;
  onToggleComplete: () => void;
  onUpdateStatus: (status: TaskStatus) => void;
  onEdit?: () => void;
  dragHandleProps?: any;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Determine priority style
  const priorityStyle = task.priority
    ? task.priority === "high"
      ? styles.priorityHigh
      : task.priority === "medium"
      ? styles.priorityMedium
      : styles.priorityLow
    : {};

  return (
    <div
      className="card mb-3"
      style={{
        ...styles.taskCard,
        ...priorityStyle,
        opacity: task.completed ? 0.7 : 1,
      }}
      {...dragHandleProps}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="card-content p-3">
        <div className="media mb-2">
          <div className="media-left">
            <span
              className="icon is-small has-text-weight-bold has-text-white is-rounded"
              style={{ padding: "10px", borderRadius: "80%" }}
            >
              <FontAwesomeIcon
                icon={task.completed ? faCheck : statusConfig[task.status].icon}
                size="sm"
                color={statusConfig[task.status].color}
              />
            </span>
          </div>
          <div className="media-content" style={{ marginTop: "-10px" }}>
            <div
              className={`is-5 has-text-left ${
                task.completed ? "has-text-grey" : "has-text-black"
              }`}
              style={task.completed ? styles.completedTask : {}}
            >
              {task.link !== undefined ? (
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="has-text-black"
                >
                  <FontAwesomeIcon icon={faLink} size="sm" className="mr-1" />
                  {task.text}
                </a>
              ) : (
                <>{task.text}</>
              )}
            </div>

            <div
              className={`fixed-grid mt-1 mb-1 ${
                viewType === "board" ? "has-1-cols" : "has-10-cols"
              }`}
            >
              <div className="grid is-gap-0.5">
                {task.priority && (
                  <div className="cell">
                    <span
                      className={`tag ${
                        task.priority === "high"
                          ? "is-danger"
                          : task.priority === "medium"
                          ? "is-warning"
                          : "is-success"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                  </div>
                )}
                <div className="cell">
                  <span className="tag is-light has-text-grey">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="mr-1"
                      color="tomato"
                    />
                    {task.date.split("-").reverse().join("/")}
                  </span>
                </div>
                <div className="cell">
                  <span
                    className="tag"
                    style={{
                      textTransform: "capitalize",
                      backgroundColor: statusConfig[task.status].color,
                      color: "white",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={statusConfig[task.status].icon}
                      className="mr-1"
                    />
                    {statusConfig[task.status].label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="media-right">
            {viewType === "board" && (
              <div
                className="field-label is-normal"
                style={{
                  marginRight: "0px",
                  marginTop: "-10px",
                  visibility: showActions ? "visible" : "hidden",
                  transition: "visibility 0.2s ease",
                }}
              >
                {showActionMenu ? (
                  <div className="buttons has-addons">
                    {onEdit && (
                      <button
                        className="button is-small"
                        onClick={() => {
                          onEdit();
                          setShowActionMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} color="#3e8ed0" />
                      </button>
                    )}
                    <button
                      className="button is-small"
                      onClick={() => {
                        onRemove();
                        setShowActionMenu(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} color="red" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="is-medium is-pulled-right"
                    style={styles.deleteButton}
                    onClick={() => setShowActionMenu(true)}
                  >
                    <FontAwesomeIcon icon={faGear} color="#888" />
                  </button>
                )}
              </div>
            )}
            {viewType === "timeline" && (
              <div className="field has-addons mt-1">
                {task.status !== "todo" && (
                  <p className="control">
                    <button
                      className="button is-small"
                      onClick={() => onUpdateStatus("todo")}
                    >
                      {statusConfig["todo"].action}
                    </button>
                  </p>
                )}
                {task.status !== "in-progress" && (
                  <p className="control">
                    <button
                      className="button is-small"
                      onClick={() => onUpdateStatus("in-progress")}
                    >
                      {statusConfig["in-progress"].action}
                    </button>
                  </p>
                )}
                {task.status !== "postponed" && (
                  <p className="control">
                    <button
                      className="button is-small"
                      onClick={() => onUpdateStatus("postponed")}
                    >
                      {statusConfig["postponed"].action}
                    </button>
                  </p>
                )}
                {task.status !== "done" && (
                  <p className="control">
                    <button
                      className="button is-small"
                      onClick={() => onUpdateStatus("done")}
                    >
                      {statusConfig["done"].action}
                    </button>
                  </p>
                )}
                {task.status !== "closed" && (
                  <p className="control">
                    <button
                      className="button is-small"
                      onClick={() => onUpdateStatus("closed")}
                    >
                      {statusConfig["closed"].action}
                    </button>
                  </p>
                )}
                {viewType === "timeline" && (
                  <div
                    className="is-normal"
                    style={{
                      marginLeft: "20px",
                      marginTop: "1px",
                      visibility: showActions ? "visible" : "hidden",
                      transition: "visibility 0.2s ease",
                    }}
                  >
                    {showActionMenu ? (
                      <div className="buttons has-addons">
                        {onEdit && (
                          <button
                            className="button is-small"
                            onClick={() => {
                              onEdit();
                              setShowActionMenu(false);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              color="#3e8ed0"
                              size="lg"
                            />
                          </button>
                        )}
                        <button
                          className="button is-small"
                          onClick={() => {
                            onRemove();
                            setShowActionMenu(false);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            color="red"
                            size="lg"
                          />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="is-medium is-pulled-right"
                        style={styles.deleteButton}
                        onClick={() => setShowActionMenu(true)}
                      >
                        <FontAwesomeIcon icon={faGear} color="#888" size="lg" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="media-footer">
          {task.description && (
            <p className="mt-1 has-text-grey-dark text-break">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// BoardView component for kanban-style board view
const BoardView = ({
  tasks,
  onRemoveTask,
  onToggleComplete,
  onUpdateStatus,
  onEditTask,
}: {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
  onToggleComplete: (index: number) => void;
  onUpdateStatus: (index: number, status: TaskStatus) => void;
  onEditTask?: (index: number) => void;
}) => {
  // State to track dragging
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: [],
    "in-progress": [],
    postponed: [],
    done: [],
    closed: [],
  };

  tasks.forEach((task) => {
    tasksByStatus[task.status].push(task);
  });

  // Handle drag start
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      const taskIndex = tasks.findIndex((t) => t.id === draggedTask.id);
      if (taskIndex !== -1) {
        onUpdateStatus(taskIndex, status);
      }
    }
    setDraggedTask(null);
    setDragOverStatus(null);
  };

  return (
    <div style={styles.boardContainer}>
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <div
          key={status}
          style={{
            ...styles.statusColumn,
            backgroundColor: dragOverStatus === status ? "#e6f7ff" : "#f5f5f5",
          }}
          onDragOver={(e) => handleDragOver(e, status as TaskStatus)}
          onDrop={(e) => handleDrop(e, status as TaskStatus)}
        >
          <div
            style={{
              ...styles.columnHeader,
              color: statusConfig[status as TaskStatus].color,
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={statusConfig[status as TaskStatus].icon}
                style={styles.statusIcon}
              />
              {statusConfig[status as TaskStatus].label}
            </span>
            <span className="tag is-rounded">{statusTasks.length}</span>
          </div>

          <div className="mt-3">
            {statusTasks.length === 0 ? (
              <p className="has-text-centered has-text-grey-light p-4">
                No tasks
              </p>
            ) : (
              statusTasks.map((task) => {
                const originalIndex = tasks.findIndex((t) => t.id === task.id);
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                  >
                    <TaskItem
                      task={task}
                      index={originalIndex}
                      viewType="board"
                      onRemove={() => onRemoveTask(originalIndex)}
                      onToggleComplete={() => onToggleComplete(originalIndex)}
                      onUpdateStatus={(newStatus) =>
                        onUpdateStatus(originalIndex, newStatus)
                      }
                      onEdit={() => onEditTask && onEditTask(originalIndex)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// TimelineView component for timeline view
const TimelineView = ({
  tasks,
  onRemoveTask,
  onToggleComplete,
  onUpdateStatus,
  onEditTask,
}: {
  tasks: Task[];
  onRemoveTask: (index: number) => void;
  onToggleComplete: (index: number) => void;
  onUpdateStatus: (index: number, status: TaskStatus) => void;
  onEditTask?: (index: number) => void;
}) => {
  // Sort tasks by date
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};

  sortedTasks.forEach((task) => {
    if (!tasksByDate[task.date]) {
      tasksByDate[task.date] = [];
    }
    tasksByDate[task.date].push(task);
  });

  return (
    <div>
      {Object.entries(tasksByDate).map(([date, dateTasks]) => (
        <div key={date} className="mb-5">
          {dateTasks.map((task) => {
            const originalIndex = tasks.findIndex((t) => t.id === task.id);
            return (
              <TaskItem
                key={task.id}
                task={task}
                viewType="timeline"
                index={originalIndex}
                onRemove={() => onRemoveTask(originalIndex)}
                onToggleComplete={() => onToggleComplete(originalIndex)}
                onUpdateStatus={(newStatus) =>
                  onUpdateStatus(originalIndex, newStatus)
                }
                onEdit={() => onEditTask && onEditTask(originalIndex)}
              />
            );
          })}
        </div>
      ))}

      {Object.entries(tasksByDate).length === 0 && (
        <p className="has-text-centered has-background-light has-text-grey-light p-5">
          No tasks
        </p>
      )}
    </div>
  );
};

// ViewSelector component for switching between views
const ViewSelector = ({
  currentView,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
}: {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  statusFilter: TaskStatus | "all";
  onStatusFilterChange: (status: TaskStatus | "all") => void;
}) => {
  return (
    <div className="level" style={styles.viewSelector}>
      <div className="level-left">
        <div className="level-item">
          <div className="buttons has-addons">
            <button
              className={`button ${currentView === "board" ? "is-link" : ""}`}
              onClick={() => onViewChange("board")}
            >
              <FontAwesomeIcon icon={faList} className="mr-1" />
              Board
            </button>
            <button
              className={`button ${
                currentView === "timeline" ? "is-link" : ""
              }`}
              onClick={() => onViewChange("timeline")}
            >
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              Timeline
            </button>
          </div>
        </div>
      </div>

      {currentView !== "board" && (
        <div className="level-right">
          <div className="level-item">
            <div className="field has-addons">
              <p className="control">
                <button className="button is-static" style={{ height: "100%" }}>
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              </p>
              <p className="control">
                <div className="select">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      onStatusFilterChange(e.target.value as TaskStatus | "all")
                    }
                  >
                    <option value="all">All Tasks</option>
                    <option value="todo">{statusConfig.todo.label}</option>
                    <option value="in-progress">
                      {statusConfig["in-progress"].label}
                    </option>
                    <option value="postponed">
                      {statusConfig.postponed.label}
                    </option>
                    <option value="done">{statusConfig.done.label}</option>
                    <option value="closed">{statusConfig.closed.label}</option>
                  </select>
                </div>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Tasks component
function Tasks() {
  const { formData } = useFormContext();
  const [currentView, setCurrentView] = useState<ViewType>("board");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Convert existing string tasks or Task objects to the new Task interface
  const initialTasks = Array.isArray(formData.tasks)
    ? formData.tasks.map((task) => {
        if (typeof task === "string") {
          return {
            id: generateId(),
            text: task,
            completed: false,
            date: new Date().toISOString().split("T")[0],
            status: "todo" as TaskStatus,
          };
        } else if (typeof task === "object" && task !== null) {
          // Handle existing Task objects that might not have all the new fields
          const taskObj = task as any; // Use any to avoid TypeScript errors
          return {
            id: taskObj.id || generateId(),
            text: taskObj.text || "",
            completed: taskObj.completed || false,
            date: taskObj.date || new Date().toISOString().split("T")[0],
            status: (taskObj.status as TaskStatus) || "todo",
            description: taskObj.description,
            priority: taskObj.priority,
          };
        }
        // Default fallback
        return {
          id: generateId(),
          text: "Unknown task",
          completed: false,
          date: new Date().toISOString().split("T")[0],
          status: "todo" as TaskStatus,
        };
      })
    : [];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Filter tasks based on status filter
  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const updateTasks = (newTasks: Task[]) => {
    // Store the tasks in storage and update the state
    setStorage({ tasks: newTasks }, () => {
      // Update formData.tasks - need to handle type compatibility
      // @ts-ignore - We're intentionally changing the type from string[] to Task[]
      formData.tasks = newTasks;
      setTasks(newTasks);
    });
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks);
  };

  const handleAddOrUpdateTask = (task: Task) => {
    if (editingTask) {
      // Update existing task
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        const newTasks = [...tasks];
        newTasks[taskIndex] = task;
        updateTasks(newTasks);
        setEditingTask(undefined); // Clear editing state
      }
    } else {
      // Add new task
      const newTasks = [...tasks, task];
      updateTasks(newTasks);
    }
  };

  const handleEditTask = (index: number) => {
    setEditingTask(tasks[index]);
  };

  const handleCancelEdit = () => {
    setEditingTask(undefined);
  };

  const handleToggleComplete = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...newTasks[index],
      completed: !newTasks[index].completed,
      // If completing a task, also update its status to 'done'
      status: newTasks[index].status,
    };
    updateTasks(newTasks);
  };

  const handleUpdateStatus = (index: number, status: TaskStatus) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...newTasks[index],
      status,
      // If status is 'done', also mark as completed
      completed: status === "done",
    };
    updateTasks(newTasks);
  };

  return (
    <div className="hero-body" style={styles.heroBody}>
      <div className="container">
        <TaskInput
          onAddTask={handleAddOrUpdateTask}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        <ViewSelector
          currentView={currentView}
          onViewChange={setCurrentView}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {currentView === "board" && (
          <BoardView
            tasks={tasks}
            onRemoveTask={handleRemoveTask}
            onToggleComplete={handleToggleComplete}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
          />
        )}

        {currentView === "timeline" && (
          <TimelineView
            tasks={filteredTasks}
            onRemoveTask={handleRemoveTask}
            onToggleComplete={handleToggleComplete}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
          />
        )}
      </div>
    </div>
  );
}

export default Tasks;
