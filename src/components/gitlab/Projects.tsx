/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, chunkArray, fetchFromGitlab } from "../../utils";

function Projects(props: { user: any }) {
  const { formData } = useFormContext();
  const [projects, setProjects] = useState([]);

  const fetchOwnerProjects = async () => {
    const url = [
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.projects.replace(':user_id', props.user.id)
    ].join('/');

    const data = await fetchFromGitlab(url, formData.gitlabToken);
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
    <div className="control">
      {chunkArray(projects, 2).map((chunk: any, chunkIndex: number) => (
        <div className="columns" key={chunkIndex}>
          {chunk.map((item: ProjectType) => (
            <div key={item.id} className="cell has-background-white p-2 column">
              <div className="card">
                <div className="card-content">
                  <div className="media">
                    {item?.avatar_url && <div className="media-left">
                      <figure className="image is-48x48">
                        <img
                          src={item?.avatar_url}
                          alt={item?.name}
                          className="is-rounded"
                        />
                      </figure>
                    </div>}
                    <div className="media-content">
                      <a href={item?.web_url} target="_blank">
                        <p className="">{item?.name}</p>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="content">
                    {item.description}
                    <br />
                    Last Updated At: <time>{new Date(item?.last_activity_at).toISOString().split('T')[0]}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Projects;
