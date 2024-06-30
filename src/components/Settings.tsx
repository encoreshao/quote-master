/// <reference types="chrome"/>
/* eslint-disable jsx-a11y/anchor-is-valid */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBandcamp, faGithub, faGitlab } from "@fortawesome/free-brands-svg-icons";
import { useFormContext } from "../contexts/FormContext";


function Settings() {
  const { formData, handleChange } = useFormContext();

  return (
    <div className="hero-body" id="quotes" hidden>
      <div className="container has-text-centered">
        <p className="title">Settings</p>
        <p className="subtitle">
        </p>
        <div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white"> Personal </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded has-icons-left">
                  <input
                    className="input" type="text" placeholder="Name" name="username"
                    onChange={handleChange} value={formData.username}
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
              <div className="field">
                <p className="control is-expanded has-icons-left">
                  <input
                    className="input" type="tel" name="telphone" placeholder="Your phone number"
                    onChange={handleChange} value={formData.telphone}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label">
              <label className="label has-text-white"> Links </label>
            </div>
            <div className="field-body">
              <div className="field is-expanded">
                <div className="field has-addons">
                  <p className="control">
                    <a className="button is-static">
                      <FontAwesomeIcon icon={faGitlab} fontSize="24" />
                    </a>
                  </p>
                  <p className="control">
                    <a className="button is-static">
                      Gitlab
                    </a>
                  </p>
                  <p className="control is-expanded">
                    <input
                      className="input" type="text" name="gitlab" placeholder="Your gitlab link"
                      onChange={handleChange} value={formData.gitlab}
                    />
                  </p>
                </div>
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
                      <FontAwesomeIcon icon={faGithub} fontSize="24"/>
                    </a>
                  </p>
                  <p className="control">
                    <a className="button is-static">
                      Github
                    </a>
                  </p>
                  <p className="control is-expanded">
                    <input
                      className="input" type="text" name="github" placeholder="Your github link"
                      onChange={handleChange} value={formData.github}
                    />
                  </p>
                </div>
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
                      <FontAwesomeIcon icon={faBandcamp} fontSize="24"/>
                    </a>
                  </p>
                  <p className="control">
                    <a className="button is-static">
                      BambooHR
                    </a>
                  </p>
                  <p className="control is-expanded">
                    <input
                      className="input" type="text" name="bamboohr" placeholder="Your bambooHR link"
                      onChange={handleChange} value={formData.bamboohr}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white"> Default Tab </label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <div className="select is-fullwidth is-rounded">
                    <select name="defaultTab" onChange={handleChange} value={formData.defaultTab}>
                      <option value="overview" > Overview </option>
                      <option value="dashboard"> Dashboard </option>
                      <option value="quotes"> Quotes </option>
                      <option value="gitlab"> GitLab </option>
                    </select>
                  </div>
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
                  <label className="checkbox has-text-white mr-5">
                    <input type="checkbox" name="enabledDashboard" className="mr-2" onChange={handleChange} checked={formData.enabledDashboard}/>
                    Dashboard
                  </label>
                  <label className="checkbox has-text-white mr-5">
                    <input type="checkbox" name="enabledGitlub" className="mr-2" onChange={handleChange} checked={formData.enabledGitlub}/>
                    GitLab
                  </label>
                  <label className="checkbox has-text-white mr-5">
                    <input type="checkbox" name="enabledQuotes" className="mr-2" onChange={handleChange} checked={formData.enabledQuotes}/>
                    Quotes
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label has-text-white"> Overview </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea" name="overview" placeholder="Explain how we can help you"
                    onChange={handleChange} value={formData.overview}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
