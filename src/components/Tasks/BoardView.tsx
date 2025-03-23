import { useState } from "react";
import { statusConfig, styles, Task, TaskStatus } from "../../types/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskItem from "./TaskItem";

// BoardView component for kanban-style board view
export const BoardView = ({
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
