/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState } from "react";

import { useFormContext } from "../../contexts/FormContext";
import { setStorage } from "../../utils";
import {
  generateId,
  styles,
  Task,
  TaskDefaultConfig,
  TaskStatus,
  ViewType,
} from "../../types/Task";

import { TaskForm } from "./TaskForm";
import { BoardView } from "./BoardView";
import { TimelineView } from "./TimelineView";
import { ViewSelector } from "./ViewSelector";

// NOTE: To enable drag and drop functionality, install the following package:
// npm install react-beautiful-dnd

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
            link: "",
            completed: false,
            date: new Date().toISOString().split("T")[0],
            status: TaskDefaultConfig.status as TaskStatus,
          };
        } else if (typeof task === "object" && task !== null) {
          // Handle existing Task objects that might not have all the new fields
          const taskObj = task as any; // Use any to avoid TypeScript errors
          return {
            id: taskObj.id || generateId(),
            text: taskObj.text || "",
            link: taskObj.link || "",
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
          link: "",
          completed: false,
          date: new Date().toISOString().split("T")[0],
          status: TaskDefaultConfig.status as TaskStatus,
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
        <TaskForm
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
