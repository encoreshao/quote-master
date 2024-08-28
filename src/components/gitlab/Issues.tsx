/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, fetchFromGitlab } from "../../utils";

function Issues(props: { user: any }) {
  const { formData } = useFormContext();
  const [issues, setIssues] = useState([]);

  const fetchOwnerIssues = async () => {
    const url = [
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.issues.replace(':user_id', props.user.id)
    ].join('/');

    const data = await fetchFromGitlab(url, formData.gitlabToken);
    if (data) setIssues(data);
  };

  useEffect(() => {
    const initFetches = async () => {
      if (formData.gitlab && formData.gitlabToken && props.user?.id !== 'xxx') {
        await fetchOwnerIssues();
      }
    };

    initFetches();
  }, [props.user?.id])

  return (
    <div className="control">
      {issues.map((item: IssueType) => (
        <article className="message is-success" key={item.id}>
          <div className="message-header">
            <p>
              <a href={item.web_url} target="_blank">
                #{item?.iid}
              </a> {item?.title} -
              <a href={item.assignee.web_url} target="_blank">
                {item.assignee.name}
              </a>
            </p>
            <time>
              {new Date(item?.created_at).toISOString().split('T')[0]}
              &nbsp; To &nbsp;
              {new Date(item?.updated_at).toISOString().split('T')[0]}
              &nbsp;&nbsp;
              ({item.labels.join(', ')})
            </time>
          </div>
          <div className="message-body">
            {item.description}
          </div>
        </article>
      ))}
    </div>
  );
}

export default Issues;
