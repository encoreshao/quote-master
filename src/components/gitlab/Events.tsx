/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, fetchFromGitlab } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faClose, faCodeFork, faComment, faTrash } from "@fortawesome/free-solid-svg-icons";

function Events(props: { user: any }) {
  const { formData } = useFormContext();
  const [events, setEvents] = useState([]);

  const fetchOwnerIssues = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.events.replace(':user_id', props.user.id)
    ].join('/'), formData.gitlabToken);
    if (data) setEvents(data);
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
      className="control pb-1"
      style={
        { overflowY: 'auto', height: "calc(100vh - 280px)", boxSizing: "border-box" }
      }
    >
      {events.map((item: EventType) => (
        <div className="timeline has-background-white pb-2" key={item.id}>
          <div className="timeline-item" style={{ paddingBottom: '0px' }}>
            <div className="timeline-marker is-warning is-image is-32x32">
              <img src={item.author.avatar_url} alt={item.author.name}></img>
            </div>

            <div className="timeline-content">
              <em className="p-2 has-text-link" style={{position: "absolute", right: '20px'}}>
                {new Date(item?.created_at).toISOString().split('T').join(' ')}
              </em>
              <p className="heading has-text-left">
                <a href={item.author.web_url} target="_blank">
                  {item.author?.name}
                </a>
                &nbsp;
                @{item.author?.username}
              </p>

              <p className="has-text-left mt-1">
                {item.action_name === 'commented on' && <>
                  <FontAwesomeIcon icon={faComment} className="mr-1"/>

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.note?.noteable_type} #{item.note?.noteable_iid}
                  </strong>
                  "{item.target_title}"
                </>}

                {(item.action_name === 'pushed to' || item.action_name === 'pushed new') && <>
                  <FontAwesomeIcon icon={faCodeFork} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.push_data?.ref_type} '{item.push_data?.ref}' {item.push_data?.commit_title}
                  </strong>
                </>}

                {(item.action_name === 'created') && <>
                  <FontAwesomeIcon icon={faCodeFork} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name}
                  </strong>
                </>}

                {item.action_name === 'accepted' && <>
                  <FontAwesomeIcon icon={faCodeFork} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.target_type} #{item.target_iid}
                  </strong>
                  "{item.target_title}"
                </>}

                {item.action_name === 'opened' && <>
                  <FontAwesomeIcon icon={faCircleDot} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.target_type} #{item.target_iid}
                  </strong>
                  "{item.target_title}"
                </>}

                {item.action_name === 'closed' && <>
                  <FontAwesomeIcon icon={faClose} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.target_type} #{item.target_iid}
                  </strong>
                  "{item.target_title}"
                </>}

                {item.action_name === 'deleted' && <>
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />

                  <strong className="has-text-grey mr-1">
                    {item.action_name} {item.push_data?.ref_type} {item.push_data?.ref}
                  </strong>
                </>}
              </p>

              {item.note?.body &&
                <div
                  className="has-text-left mt-2"
                  style={{ maxHeight: '100px', overflowY: 'auto', padding: '10px' }}
                  dangerouslySetInnerHTML={{ __html: replaceUserMentionsWithLinks(item.note?.body) }}
                />
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;
