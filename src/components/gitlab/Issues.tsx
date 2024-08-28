/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, fetchFromGitlab } from "../../utils";

function Issues(props: { user: any }) {
  const { formData } = useFormContext();
  const [issues, setIssues] = useState([]);

  const fetchOwnerIssues = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.issues.replace(':user_id', props.user.id)
    ].join('/'), formData.gitlabToken);
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
        <article className="message is-link" key={item.id}>
          <div className="message-header">
            <p>
              <a href={item.web_url} target="_blank">
                #{item?.iid}
              </a> {item?.title}
            </p>
            <time>
              {new Date(item?.created_at).toISOString().split('T')[0]}
              &nbsp; To &nbsp;
              {new Date(item?.updated_at).toISOString().split('T')[0]}
            </time>
          </div>

          <div className="message-body has-text-left">
            {item.description}
          </div>

          <div className="message-body has-text-right">
            <strong>Assignee: </strong>
            <a href={item.assignee.web_url} target="_blank">
              {item.assignee.name}
            </a>
            &nbsp;
            &nbsp;
            <strong>Tags: </strong> {item.labels.join(', ')}
          </div>
        </article>
      ))}
    </div>
  );
}

export default Issues;
