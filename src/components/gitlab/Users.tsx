/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import { gitlabAPIURLs, chunkArray, fetchFromGitlab } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Users(props: { user: any }) {
  const { formData } = useFormContext();
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const fetchGitlabOwners = async () => {
    const data = await fetchFromGitlab([
      formData.gitlab,
      (formData.gitlabAPIVersion || 'api/v4'),
      gitlabAPIURLs.users
    ].join('/'), formData.gitlabToken);
    if (data) {
      setAllUsers(data);
      setUsers(data);
    }
    // .sort(() => Math.random() - 0.5)
  };

  useEffect(() => {
    const initFetches = async () => {
      if (formData.gitlab && formData.gitlabToken && props.user?.id !== 'xxx') {
        await fetchGitlabOwners();
      }
    };

    initFetches();
  }, [props.user?.id])

  useEffect(() => { handleSearch() }, [keyword])

  const handleSearch = () => {
    if (keyword.trim()) {
      setUsers((allUsers).filter((item: UserType) => new RegExp(keyword, 'i').exec(item.name)));
    } else {
      setUsers(allUsers);
    }
  };

  return (
    <>
      <div className="control">
        <div className="control has-icons-left" style={{ width: '100%' }}>
          <input
            className="input is-focused is-link"
            type="text"
            placeholder="Search by user name..."
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
          <span className="icon is-medium is-left">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>

      <br />
      <div className="control">
        {chunkArray(users, 5).map((chunk: any, chunkIndex: number) => (
          <div className="columns" key={chunkIndex}>
            {chunk.map((item: UserType) => (
              <div key={item.id} className="cell has-background-white p-2 column">
                <div className="card">
                  <div className="card-content">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img
                            src={item?.avatar_url}
                            alt={item?.name}
                            className="is-rounded"
                          />
                        </figure>
                      </div>
                      <div className="media-content has-text-left">
                        <a href={item?.web_url} target="_blank">
                          <p className="">{item?.name}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Users;
