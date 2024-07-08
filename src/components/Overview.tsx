/* eslint-disable jsx-a11y/anchor-is-valid */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from '../contexts/FormContext';
import DateTime from './DateTime';
import { useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setStorage } from '../utils';

function Overview() {
  const { formData } = useFormContext();
  const [searchEngine, setSearchEngine] = useState(formData.searchEngine);
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (keyword.trim()) {
      window.open(`${formData.searchEngine}${keyword}`, '_blank')
    }
  };

  const handleSearachEngine = (event: any) => {
    const selectedSearchEngine = event.target.value

    setStorage({ searchEngine: selectedSearchEngine }, () => {
      formData.searchEngine = selectedSearchEngine
      setSearchEngine(selectedSearchEngine)
    });
  };

  return (
    <>
      <div className="hero-body">
        <div className="container has-text-centered">
          <DateTime wday={true} />
          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field is-expanded">
                <div className="field has-addons">
                  <div className="control has-icons-left">
                    <div className="select">
                      <select
                        value={searchEngine}
                        onChange={(event) => handleSearachEngine(event)}
                      >
                        <option value={'https://www.google.com/search?q='}>
                          Google
                        </option>
                        <option value={'https://www.bing.com/search?q='}>
                          Bing
                        </option>
                        <option value={'https://search.aol.com/aol/search?q='}>
                          AOL
                        </option>
                        <option value={'https://duckduckgo.com/?ia=web&q='}>
                          DuckDuckGo
                        </option>
                        <option value={'https://www.baidu.com/s?wd='}>
                          Baidu
                        </option>
                        <option value={'https://github.com/search?type=repositories&q='}>
                          Github
                        </option>
                      </select>
                    </div>

                    <div className="icon is-small is-left">
                      <FontAwesomeIcon icon={faSearch} />
                    </div>
                  </div>
                  <p className="control is-expanded">
                    <input
                      className="input is-focused is-info"
                      type="text"
                      placeholder="Search by keyword..."
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      value={keyword}
                    />
                  </p>
                  <button
                    className="button is-link ml-2"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>

      {formData.overview &&
        <div className="card has-background-primary-100">
          <div className="container card-content">
            <p className="title">
              Hello! {formData.username}
            </p>
            <br />
            <p className="subtitle">
              {formData.overview}
            </p>
          </div>
        </div>
      }
    </>
  );
}

export default Overview;
