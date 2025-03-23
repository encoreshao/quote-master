/// <reference types="chrome"/>
/* eslint-disable jsx-a11y/anchor-is-valid */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faBandcamp,
  faBots,
  faGithub,
  faGitlab,
} from "@fortawesome/free-brands-svg-icons";
import { useFormContext } from "../contexts/FormContext";
import { QuoteMaster } from "../utils/common";

function Settings() {
  const { formData, handleChange } = useFormContext();

  return (
    <>
      <div className="hero-body" style={{ alignItems: "baseline" }}>
        <div className="container has-text-centered">
          <div
            className="fixed-grid pt-2 pb-2"
            style={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}
          >
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label has-text-white"> Information </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control is-expanded has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="Your name"
                      name="username"
                      onChange={handleChange}
                      value={formData.username}
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
                      className="input"
                      type="tel"
                      name="telphone"
                      placeholder="Your phone number"
                      onChange={handleChange}
                      value={formData.telphone}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={faPhone} />
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
                        <FontAwesomeIcon icon={faImage} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">Background</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="backgroundUrl"
                        placeholder="The background image URL"
                        onChange={handleChange}
                        value={formData.backgroundUrl}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label has-text-white">
                  {" "}
                  Customized Links{" "}
                </label>
              </div>
              <div className="field-body">
                <div className="field is-expanded">
                  <div className="field has-addons">
                    <p className="control">
                      <a className="button is-static">
                        <FontAwesomeIcon icon={faGithub} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">Github</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="github"
                        placeholder="Your github link"
                        onChange={handleChange}
                        value={formData.github}
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
                        <FontAwesomeIcon icon={faBandcamp} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">BambooHR</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="bamboohr"
                        placeholder="Your bambooHR link"
                        onChange={handleChange}
                        value={formData.bamboohr}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label has-text-white mt-3"> ChatBOTs </label>
              </div>
              <div className="field-body">
                <div className="field is-expanded">
                  <div className="field has-addons">
                    <p className="control">
                      <a className="button is-static">
                        <FontAwesomeIcon icon={faBots} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">OpenAI</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="openAIChatBotURL"
                        placeholder="OpenAI chat link"
                        onChange={handleChange}
                        value={formData.openAIChatBotURL}
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
                        <FontAwesomeIcon icon={faBots} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">DeepSeek</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="deepSeekChatBotURL"
                        placeholder="DeepSeek chat link"
                        onChange={handleChange}
                        value={formData.deepSeekChatBotURL}
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
                        <FontAwesomeIcon icon={faBots} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">Google Gemini</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="geminiChatBotURL"
                        placeholder="Google Gemini chat link"
                        onChange={handleChange}
                        value={formData.geminiChatBotURL}
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
                        <FontAwesomeIcon icon={faBots} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">Grok</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="grokChatBotURL"
                        placeholder="X Grok chat link"
                        onChange={handleChange}
                        value={formData.grokChatBotURL}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label has-text-white"> GitLab Setting </label>
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
                      <a className="button is-static">Web URL</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        name="gitlab"
                        placeholder="Your GitLab Web Link"
                        onChange={handleChange}
                        value={formData.gitlab}
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
                        <FontAwesomeIcon icon={faGitlab} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">API Version</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        autoComplete="off"
                        name="gitlabAPIVersion"
                        placeholder="api/v4"
                        onChange={handleChange}
                        value={formData.gitlabAPIVersion}
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
                        <FontAwesomeIcon icon={faGitlab} fontSize="24" />
                      </a>
                    </p>
                    <p className="control">
                      <a className="button is-static">Access Token</a>
                    </p>
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        autoComplete="off"
                        name="gitlabToken"
                        placeholder="Personal Access Token (glpat-xxx)"
                        onChange={handleChange}
                        value={formData.gitlabToken}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label has-text-white mt-3">
                  {" "}
                  Navigation{" "}
                </label>
              </div>
              <div className="field-body">
                <div className="field is-narrow">
                  <div className="control">
                    <input
                      id="enabledGmail"
                      type="checkbox"
                      name="enabledGmail"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledGmail}
                    />
                    <label
                      htmlFor="enabledGmail"
                      className="has-text-white mr-5"
                    >
                      Gmail
                    </label>
                    <input
                      id="enabledDownloads"
                      type="checkbox"
                      name="enabledDownloads"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledDownloads}
                    />
                    <label
                      htmlFor="enabledDownloads"
                      className="has-text-white mr-5"
                    >
                      Downloads
                    </label>
                    <input
                      id="enabledExtensions"
                      type="checkbox"
                      name="enabledExtensions"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledExtensions}
                    />
                    <label
                      htmlFor="enabledExtensions"
                      className="has-text-white mr-5"
                    >
                      Extensions
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label">
                <label className="label has-text-white mt-3"> Tabs </label>
              </div>
              <div className="field-body">
                <div className="field is-narrow">
                  <div className="control">
                    <input
                      id="enabledQuotes"
                      type="checkbox"
                      name="enabledQuotes"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledQuotes}
                    />
                    <label
                      htmlFor="enabledQuotes"
                      className="has-text-white mr-5"
                    >
                      Quotes
                    </label>
                    <input
                      id="enabledTasks"
                      type="checkbox"
                      name="enabledTasks"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledTasks}
                    />
                    <label
                      htmlFor="enabledTasks"
                      className="has-text-white mr-5"
                    >
                      Tasks
                    </label>
                    <input
                      id="enabledGitLab"
                      type="checkbox"
                      name="enabledGitLab"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledGitLab}
                    />
                    <label
                      htmlFor="enabledGitLab"
                      className="has-text-white mr-5"
                    >
                      GitLab
                    </label>
                    <input
                      id="enabledBookmarks"
                      type="checkbox"
                      name="enabledBookmarks"
                      className="mr-2 switch is-rounded is-info"
                      onChange={handleChange}
                      checked={formData.enabledBookmarks}
                    />
                    <label
                      htmlFor="enabledBookmarks"
                      className="has-text-white mr-5"
                    >
                      Bookmarks
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
                      className="textarea"
                      name="overview"
                      placeholder="Say something to introduce yourself"
                      onChange={handleChange}
                      value={formData.overview}
                    />
                  </div>
                </div>
              </div>
            </div>

            {false && (
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label has-text-white">
                    {" "}
                    Pinned Bookmarks{" "}
                  </label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      {formData.pinBookmarks.map((bookmarkId: string) => (
                        <label className="checkbox has-text-white mr-5">
                          <input
                            type="checkbox"
                            name="pinBookmarks"
                            className="mr-2"
                            checked={formData.pinBookmarks.includes(bookmarkId)}
                            value={bookmarkId}
                          />
                          {bookmarkId}
                        </label>
                      ))}

                      {formData.pinBookmarks.length === 0 && (
                        <p className="help has-text-white">
                          No pinned bookmarks
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <article
        className="message has-text-centered has-background-white has-text-black"
        style={{ marginBottom: "0px" }}
      >
        <div className="message-body">
          <p>
            <strong>Quote Master</strong> by{" "}
            <a href={QuoteMaster.homepageURL}>{QuoteMaster.authorName}</a>. If
            you have a idea? Please contact me ({QuoteMaster.authorEmail}).
          </p>
        </div>
      </article>
    </>
  );
}

export default Settings;
