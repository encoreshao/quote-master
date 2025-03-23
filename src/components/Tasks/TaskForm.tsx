import { useEffect, useState } from "react";
import { generateId, styles, Task } from "../../types/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faCalendarAlt,
  faLink,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

// TaskInput component for adding or editing tasks
export const TaskForm = ({
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

      resetForm();
    }
  };

  const resetForm = () => {
    // Reset form and cancel edit
    setInput("");
    setLink("");
    setDate("");
    setDescription("");
    setPriority("medium");
    setShowAdvanced(false);
  };

  const handleCancel = () => {
    resetForm();
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
