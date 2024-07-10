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
      <div className="hero-body" style={{ alignItems: 'baseline', marginTop: '5%' }}>
        <div className="container has-text-centered">
          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field is-expanded">
                <div className="field has-addons" style={{ justifyContent: 'center' }}>
                  <div className="control">
                    <div className="select is-link">
                      <select
                        value={searchEngine}
                        onChange={(event) => handleSearachEngine(event)}
                        className='has-text-centered'
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
                  </div>

                  <div className="control has-icons-left" style={{ width: '40%' }}>
                    <input
                      className="input is-focused is-link"
                      type="text"
                      placeholder="Search by keyword..."
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      value={keyword}
                    />
                    <span className="icon is-medium is-left">
                      <FontAwesomeIcon icon={faSearch} />
                    </span>
                  </div>
                  <div className="control">
                    <button
                      className="button is-link"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="has-text-centered" style={{ marginTop: '10%' }}>
            <DateTime wday={true} />
          </div>
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
