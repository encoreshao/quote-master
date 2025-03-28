import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCheck,
  faTrash,
  faLink,
  faEdit,
  faGear,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  statusConfig,
  styles,
  Task,
  TaskDefaultConfig,
  TaskPriority,
  TaskStatus,
} from "../../types/Task";

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
      : task.priority === (TaskDefaultConfig.priority as TaskPriority)
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
                          : task.priority ===
                            (TaskDefaultConfig.priority as TaskPriority)
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

          <div
            className="media-right"
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
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
                  <div
                    className="buttons"
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",
                      gap: "0.1rem",
                    }}
                  >
                    <button
                      className="button is-small is-rounded"
                      onClick={() => {
                        onRemove();
                        setShowActionMenu(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} color="red" />
                    </button>
                    {onEdit && (
                      <button
                        className="button is-small is-rounded"
                        onClick={() => {
                          onEdit();
                          setShowActionMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} color="#3e8ed0" />
                      </button>
                    )}
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
                      <div
                        className="buttons"
                        style={{
                          display: "flex",
                          flexDirection: "column-reverse",
                          gap: "0.1rem",
                        }}
                      >
                        {onEdit && (
                          <button
                            className="button is-small is-rounded"
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
                          className="button is-small is-rounded"
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

export default TaskItem;
