/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, fetchFromGitlab } from "../../utils";
import Logo from "./../../assets/icons/icon48.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLayerGroup, faLink, faReply, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { fa42Group } from "@fortawesome/free-brands-svg-icons";

function Projects(props: { user: any }) {
  const { formData } = useFormContext();
  const [projects, setProjects] = useState([]);

  const fetchOwnerProjects = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.projects.replace(':user_id', props.user.id)
    ].join('/'), formData.gitlabToken);
    if (data) setProjects(data.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    const initFetches = async () => {
      if (formData.gitlab && formData.gitlabToken && props.user?.id !== 'xxx') {
        await fetchOwnerProjects();
      }
    };

    initFetches();
  }, [props.user?.id])

  return (
    <div className="fixed-grid has-1-cols">
      <div className="grid">
        {projects.map((item: ProjectType) => (
          <div key={item.id} className="cell">
            <div className="box has-text-left">
              {/* {item?.avatar_url && <article className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img
                      src={item?.avatar_url}
                      alt={item?.name}
                      className="is-rounded"
                    />
                  </figure>
                </div>
              </article>} */}

              <div className="media-content">
                <div className="content mb-2">
                  <p>
                    <strong>{item?.name}</strong> <small>{new Date(item?.last_activity_at).toISOString().split('T')[0]}</small>
                    <small>{item.star_count}</small>
                    <br />
                    {item.description}
                  </p>
                </div>
              </div>

              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="reply" href={item.web_url} target="_blank">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faLink} />
                    </span>
                  </a>
                  <a className="level-item" aria-label="retweet" href={item.namespace.web_url} target="_blank">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faLayerGroup} />
                    </span>
                  </a>
                  {/* <a className="level-item" aria-label="like">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                  </a> */}
                </div>
              </nav>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
