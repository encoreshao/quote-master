/// <reference types="chrome"/>
/* eslint-disable jsx-a11y/anchor-is-valid */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { getStorage, setStorage } from "../utils";

function Settings() {
  const [userName, setUserName] = useState<string | undefined>('');

  useEffect(() => {
    getStorage({ userName: "Give me a coffee" }, result =>
      setUserName(result.userName)
    )
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);

    setStorage({ userName }, () => {
      console.log('User name saved.');
    });
  };

  return (
    <div className="hero-body" id="quotes" hidden>
      <div className="container has-text-centered">
        <p className="title">Settings</p>
        <p className="subtitle">
        </p>
        <div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white"> Your Name </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded has-icons-left">
                  <input
                    className="input" type="text" placeholder="Name"
                    onChange={handleChange} value={userName}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label"></div>
            <div className="field-body">
              <div className="field is-expanded">
                <div className="field has-addons">
                  <p className="control">
                    <a className="button is-static">
                      +44
                    </a>
                  </p>
                  <p className="control is-expanded">
                    <input className="input" type="tel" placeholder="Your phone number" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white">Department</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <div className="select is-fullwidth is-rounded">
                    <select>
                      <option>Business development</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label">
              <label className="label has-text-white"> Links </label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <label className="checkbox has-text-white">
                    <input type="checkbox" name="links" className="mr-2"/>
                    Gmail
                  </label>
                  <label className="checkbox has-text-white m-2">
                    <input type="checkbox" name="links" className="mr-2"/>
                    BamhooHR
                  </label>
                  <label className="checkbox has-text-white m-2">
                    <input type="checkbox" name="links" className="mr-2"/>
                    Github
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label">
              <label className="label has-text-white"> Tabs </label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <label className="checkbox has-text-white">
                    <input type="checkbox" name="tabs" className="mr-2"/>
                    GitLab
                  </label>
                  <label className="checkbox has-text-white m-2">
                    <input type="checkbox" name="tabs" className="mr-2"/>
                    Quotes
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white">GitLab Options</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <input className="input" type="text" placeholder="e.g. Partnership opportunity" />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white">Question</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <textarea className="textarea" placeholder="Explain how we can help you"></textarea>
                </div>
              </div>
            </div>
          </div>

          {/*
          <div className="field is-horizontal">
            <div className="field-label">
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <button className="button is-link">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Settings;
