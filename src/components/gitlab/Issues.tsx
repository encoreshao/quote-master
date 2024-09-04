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

  const replaceUserMentionsWithLinks = (text: string) => {
    return text.replace(/@(\w+)/g, (match, username) => {
      return `<a href="${formData.gitlab}/${username}" target="_blank">${match}</a>`;
    });
  };

  return (
    <div
      className="control p-4"
      style={
        { overflowY: 'auto', height: "calc(100vh - 280px)", boxSizing: "border-box" }
      }
    >
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

          <div
            className="message-body has-text-left"
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: "nowrap"
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: replaceUserMentionsWithLinks(item.description) }} />
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
