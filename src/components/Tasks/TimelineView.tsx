import { Task, TaskStatus } from "../../types/Task";
import TaskItem from "./TaskItem";

// TimelineView component for timeline view
export const TimelineView = ({
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
