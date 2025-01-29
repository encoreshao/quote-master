import { useEffect, useState } from "react";
import { useFormContext } from "../contexts/FormContext";
import { setStorage } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCog, faDashboard, faTasks } from "@fortawesome/free-solid-svg-icons";
import { faGitlab, faQuora } from "@fortawesome/free-brands-svg-icons";

/* eslint-disable jsx-a11y/anchor-is-valid */
function HeroFooter(props: { setTab: (arg0: string) => void; tab: string }) {
  const { formData } = useFormContext();
  const [browserChrome, setBrowserChrome] = useState(false);

  useEffect(() => {
    var chromeStorage = false;
    if (chrome.storage) chromeStorage = true;

    setBrowserChrome(chromeStorage)
  }, [])

  const handleClick = (whichTab: string) => {
    setStorage({ 'currentTab': whichTab }, () => {
      props.setTab(whichTab)
      formData.currentTab = whichTab;
    });
  };

  return (
    <>
      <div className="hero-foot">
        <nav className="tabs is-boxed is-fullwidth has-background-primary-100">
          <div className="container">
            <ul>
              <li
                onClick={() => handleClick('overview')}
                className={props.tab === 'overview' ? 'is-active' : ''}
              >
                <a className="white">
                  Overview
                </a>
              </li>
              {formData.enabledDashboard && <li
                onClick={() => handleClick('dashboard') }
                className={props.tab === 'dashboard' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faDashboard} className="mr-1" />
                  Dashboard
                </a>
              </li>}
              {formData.enabledQuotes && <li
                onClick={() => handleClick('quotes')}
                className={props.tab === 'quotes' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faQuora} className="mr-1" />
                  Quotes
                </a>
              </li>}
              {formData.enabledTasks && <li
                onClick={() => handleClick('tasks')}
                className={props.tab === 'tasks' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faTasks} className="mr-1" />
                  Tasks
                </a>
              </li>}
              {formData.enabledGitLab && <li
                onClick={() => handleClick('gitlab')}
                className={props.tab === 'gitlab' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faGitlab} className="mr-1" />
                  GitLab
                </a>
              </li>}
              {browserChrome && formData.enabledBookmarks && <li
                onClick={() => handleClick('bookmarks')}
                className={props.tab === 'bookmarks' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faBookmark} className="mr-1" />
                  Bookmarks
                </a>
              </li>}
              <li
                onClick={() => handleClick('settings')}
                className={props.tab === 'settings' ? 'is-active' : ''}
              >
                <a>
                  <FontAwesomeIcon icon={faCog} className="mr-1" />
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default HeroFooter;
