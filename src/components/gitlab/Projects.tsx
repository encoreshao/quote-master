/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, fetchFromGitlab } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faLink, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faReadme } from "@fortawesome/free-brands-svg-icons";

function Projects(props: { user: any }) {
  const { formData } = useFormContext();
  const [projects, setProjects] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [allProjects, setAllProjects] = useState([]);

  const fetchOwnerProjects = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.projects.replace(':user_id', props.user.id)
    ].join('/'), formData.gitlabToken);
    if (data) {
      setAllProjects(data);
      setProjects(data);
    }
    // .sort(() => Math.random() - 0.5)
  };

  useEffect(() => {
    const initFetches = async () => {
      if (formData.gitlab && formData.gitlabToken && props.user?.id !== 'xxx') {
        await fetchOwnerProjects();
      }
    };

    initFetches();
  }, [props.user?.id])

  useEffect(() => { handleSearch() }, [keyword])
  const handleSearch = () => {
    if (keyword.trim()) {
      setProjects((allProjects).filter((item: ProjectType) => new RegExp(keyword, 'i').exec(item.name)));
    } else {
      setProjects(allProjects);
    }
  };

  return (
    <>
      <div className="control has-icons-left" style={{ width: '100%' }}>
        <input
          className="input is-focused is-link"
          type="text"
          placeholder="Search by project name..."
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <span className="icon is-medium is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>

      <div
        className="fixed-grid has-1-cols pb-1 mt-2"
        style={
          { overflowY: 'auto', height: "calc(100vh - 350px)", boxSizing: "border-box" }
        }
      >
        <div className="grid">
          {projects.map((item: ProjectType) => (
            <div key={item.id} className="cell">
              <div className="box has-text-left">
                {item?.avatar_url && <article className="media" style={{ position: 'absolute', right: '10px' }}>
                  <div className="media-left">
                    <figure className="image is-48x48">
                      <img
                        src={item?.avatar_url}
                        alt={item?.name}
                        className="is-rounded"
                      />
                    </figure>
                  </div>
                </article>}

                <div className="media-content">
                  <div className="content mb-2">
                    <p>
                      <strong>{item?.name_with_namespace}</strong> <small>{new Date(item?.last_activity_at).toISOString().split('T')[0]}</small>
                      <br />
                      {item.description}
                    </p>
                  </div>
                </div>

                <nav className="level is-mobile">
                  <div className="level-left">
                    <a className="level-item mr-2" target="_blank">
                      <span className="is-large">
                        Default Branch: {item.default_branch}
                      </span>
                    </a>
                    <a className="level-item mr-2" aria-label="like">
                      <span className="is-small">
                        Star: {item.star_count}
                      </span>
                    </a>
                    <a className="level-item mr-2" aria-label="reply" href={item.web_url} target="_blank">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faLink} fontSize={20} />
                      </span>
                    </a>
                    <a className="level-item mr-2" aria-label="retweet" href={item.namespace.web_url} target="_blank">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faLayerGroup} fontSize={20} />
                      </span>
                    </a>
                    <a className="level-item mr-2" aria-label="retweet" href={item.readme_url} target="_blank">
                      <span className="icon is-small">
                        <FontAwesomeIcon icon={faReadme} fontSize={20} />
                      </span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Projects;
