/* eslint-disable jsx-a11y/anchor-is-valid */

import { useState } from "react";
import { useFormContext } from "../contexts/FormContext";
import { setStorage } from "../utils";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tasks() {
  const { formData } = useFormContext();
  const [tasks, setTasks] = useState(formData.tasks);
  const [input, setInput] = useState('');

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)

    setStorage({ tasks: newTasks }, () => {
      formData.tasks = newTasks;
      setTasks(newTasks);
    });
  };

  const addTask = () => {
    if (input.trim()) {
      const newTasks = [...tasks, input.trim()]

      setStorage({ tasks: newTasks }, () => {
        formData.tasks = newTasks;
        setTasks(newTasks);
        setInput('');
      });
    }
  };

  return (
    <div className="hero-body">
      <div className="container has-text-centered">
        <p className="title"> Tasks </p>

        <div>
          <div className="field is-horizontal">
              <div className="field-body">
                <div className="field is-expanded">
                  <div className="field has-addons">
                    <p className="control">
                      <a className="button is-static">
                        <FontAwesomeIcon icon={faTasks} fontSize="24" />
                      </a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input is-focused is-info"
                        type="text"
                        placeholder="Add a new task..."
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        value={input}
                      />
                    </p>
                    <button
                      className="button is-link ml-2 has-background-link"
                      onClick={addTask}
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {tasks &&
              <div
                className='has-text-left p-1'
                style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
              >
                <div className="fixed-grid">
                  <div className="grid">
                    {tasks.map((task, index) => (
                      <div key={index} className="cell has-background-white p-2">
                        <div className="field is-horizontal">
                          <div className="field-body">
                            <div className="field">
                              <p className="control is-expanded has-icons-left">
                                <input
                                  className="input ml-3 has-text-weight-bold is-info is-static"
                                  type="text"
                                  value={task}
                                  readOnly
                                />
                                <span
                                  className="icon is-small is-left has-background-link has-text-weight-bold has-text-white is-rounded"
                                >{index + 1}</span>
                              </p>
                            </div>
                          </div>

                          <div className="field-label is-normal" style={{ marginRight: "0px" }}>
                            <button
                              className="delete is-medium is-pulled-right has-background-link"
                              onClick={() => removeTask(index)}
                            ></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
        </div>
      </div>
    </div>
  );
}

export default Tasks;
