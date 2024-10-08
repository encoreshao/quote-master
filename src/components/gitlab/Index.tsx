/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faProjectDiagram, faTasks, faUserGroup } from "@fortawesome/free-solid-svg-icons";

import { fetchFromGitlab, gitlabAPIURLs, setStorage } from "../../utils";

import Users from "./Users";
import Projects from "./Projects";
import Issues from "./Issues";
import Events from "./Events";

function Gitlab(props: { setTab: (arg0: string) => void; tab: string }) {
  const { formData } = useFormContext();
  const [me, setMe] = useState({ id: 'xxx', name: 'Anonymous', username: 'NA', email: 'NA' });
  const [activeTab, setActiveTab] = useState('events');

  const fetchGitlabOwner = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.user
    ].join('/'), formData.gitlabToken);
    if (data) setMe(data);
  };

  useEffect(() => {
    const initCurrentUser = async () => {
      if (formData.gitlabToken) { await fetchGitlabOwner(); }
    };

    initCurrentUser();
  }, [formData.gitlabToken])

  const handleClick = (whichTab: string) => {
    setStorage({ 'currentTab': whichTab }, () => {
      props.setTab(whichTab)
      formData.currentTab = whichTab;
    });
  };

  return (
    <div className="hero-body" style={{ alignItems: 'baseline' }}>
      <div className="container has-text-centered">
        <div style={{ justifyContent: 'center' }}>
          <div className="tabs is-toggle has-background-white p-4 is-centered is-toggle-rounded is-fullwidth" style={{marginBottom: '5px'}}>
            <ul>
              <li className={activeTab === 'events' ? 'is-active' : ''} onClick={() => setActiveTab('events')}>
                <a>
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faComments} />
                  </span>
                  <span>My Activity</span>
                </a>
              </li>
              <li className={activeTab === 'issues' ? 'is-active' : ''} onClick={() => setActiveTab('issues')}>
                <a>
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faTasks} />
                  </span>
                  <span>My Issues</span>
                </a>
              </li>
              <li className={activeTab === 'contributed_projects' ? 'is-active' : ''} onClick={() => setActiveTab('contributed_projects')}>
                <a>
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faProjectDiagram} />
                  </span>
                  <span>Contributed Projects</span>
                </a>
              </li>
              <li className={activeTab === 'all_users' ? 'is-active' : ''} onClick={() => setActiveTab('all_users') }>
                <a>
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faUserGroup} />
                  </span>
                  <span>All Users</span>
                </a>
              </li>
            </ul>
          </div>

          {activeTab === 'events' && me?.id !== 'xxx' && <Events user={me}/>}
          {activeTab === 'all_users' && me?.id !== 'xxx' && <Users user={me}/>}
          {activeTab === 'contributed_projects' && me?.id !== 'xxx' && <Projects user={me}/>}
          {activeTab === 'issues' && me?.id !== 'xxx' && <Issues user={me}/>}

          {me?.id === 'xxx' && <div className="card has-background-primary-100 has-text-center">
            <div className="container card-content">
              {formData.gitlab && <div className="has-text-black subtitle p-5">
                <p className="p-5">
                  If you don't have an access token, click
                  <a href={`${formData.gitlab}/-/user_settings/personal_access_tokens`} target="_blank" className="has-text-link"> here </a>
                  to generate one.
                </p>
              </div>}

              <div className="has-background-grey subtitle p-5">
                <p className="p-5">
                  You already have token, please complete
                  <a onClick={() => handleClick('settings') } className="has-text-white ml-1 mr-1" style={{textDecoration: 'underline'}}>GitLab Setting</a>
                  first.
                </p>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Gitlab;
