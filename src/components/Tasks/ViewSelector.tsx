import { faClock, faFilter, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { statusConfig, styles, TaskStatus, ViewType } from "../../types/Task";

// ViewSelector component for switching between views
export const ViewSelector = ({
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
