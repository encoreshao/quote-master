/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */

import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { useFormContext } from '../contexts/FormContext';
import { useEffect, useState } from 'react';
library.add(faCoffee)

function Dashboard() {
  const { formData } = useFormContext();
  const [pinnedBookmarks, setPinnedBookmarks] = useState([]);

  useEffect(() => {
    const bookmarkIds = formData.pinBookmarks.map((bookmarkId: string) => bookmarkId);

    chrome.runtime.sendMessage({ action: 'getBookmarkById', id: bookmarkIds }, (response) => {
      if (response && response.bookmark) {
        setPinnedBookmarks(response.bookmark);
      }
    })
  }, [formData.pinBookmarks])

  return (
    <div className="hero-body">
      <div className="container has-text-centered">
        {false && <>
          <div className='cup-wrapper'>
            <div className='cup-box shake' style={{ position: 'relative', width: 'fit-content', margin: 'auto', }}>
              <span style={{
                position: 'absolute',
                fontSize: '60px',
                left: '28%',
                top: '27%',
                zIndex: 1,
                color: "var(--bulma-hero-h)"
              }}>
                Coffee
              </span>

              <FontAwesomeIcon icon="coffee" color='white' fontSize='400'/>

              {/* <span style={{
                position: 'absolute',
                fontSize: '20px',
                left: '32%',
                top: '84%',
                zIndex: 1,
                color: "var(--bulma-hero-h)"
              }}>Give me a coffee</span> */}
            </div>
          </div>
          <hr />
        </>}

        <div className="subtitle">
          <DateTime withYear={false}/>
        </div>

        {(formData.overview || formData.username || pinnedBookmarks) &&
          <div className="card has-background-primary-100 has-text-left">
            <div className="container card-content">
              {formData.username && <>
                <p className="subtitle has-text-black">
                  Hello! {formData.username}
                </p>
              </>}
              <p className="has-text-black ml-1">
                {formData.overview}
              </p>

              {pinnedBookmarks && pinnedBookmarks.length > 0 && <>
                <hr />
                <span className="has-text-black">Pinned Bookmarks: </span>
                  {pinnedBookmarks.map((bookmark: any, index: number) => (
                      bookmark.url && <><a className="has-text-link ml-1 mr-1" href={bookmark.url} target='_blank'>
                        {bookmark.title}
                      </a> {index < pinnedBookmarks.length - 1 ? <span className='has-text-link'>|</span> : ''} </>
                  ))}
                </>
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Dashboard;
