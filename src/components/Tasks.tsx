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
    <div className="hero-body" style={{ alignItems: 'baseline' }}>
      <div className="container has-text-centered">
        {/* <div className="title">Tasks</div> */}
        <div className="field is-horizontal" style={{ marginBottom: '10%' }}>
          <div className="field-body">
            <div className="field is-expanded">
              <div className="field has-addons" style={{ justifyContent: 'center' }}>
                <div className="control has-icons-left" style={{ width: '50%' }}>
                  <input
                    className="input is-focused is-link"
                    type="text"
                    placeholder="Add a new task..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    value={input}
                  />
                  <span className="icon is-medium is-left">
                    <FontAwesomeIcon icon={faTasks} fontSize="24" />
                  </span>
                </div>
                <div className="control">
                  <button
                    className="button is-link"
                    onClick={addTask}
                  >
                    Add Task
                  </button>
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
                                    className="input ml-3 has-text-link is-static"
                                    type="text"
                                    value={task}
                                    readOnly
                                  />
                                  <span
                                    className="icon is-small is-left has-background-link has-text-weight-bold has-text-white"
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

              {tasks.length === 0 && <div className="card has-background-primary-100 has-text-center">
                <div className="container card-content">
                  <div className="has-text-black subtitle p-5">
                    No tasks yet.
                  </div>
                </div>
              </div>}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
