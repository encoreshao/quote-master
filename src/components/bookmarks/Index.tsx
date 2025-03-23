/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useState } from "react";
import { useFormContext } from "../../contexts/FormContext";
import BookmarkList from "./BookmarkList";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Bookmarks() {
  const { formData } = useFormContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [hasBookmarks, setHasBookmarks] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchBookmarks = () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
          setBookmarks(response);
          setHasBookmarks(true);
        });
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <>
      <div className="hero-body" style={{ alignItems: "baseline" }}>
        <div className="container has-text-centered">
          {/* <p className="title">Bookmarks</p> */}
          <hr />

          {formData.enabledBookmarks && hasBookmarks && (
            <div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field is-expanded">
                    <div className="field has-addons">
                      <p className="control">
                        <a className="button is-static">
                          <FontAwesomeIcon icon={faSearch} fontSize="24" />
                        </a>
                      </p>
                      <p className="control is-expanded">
                        <input
                          className="input"
                          type="text"
                          placeholder="Searching by keyword..."
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          value={searchKeyword}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {bookmarks && (
                <div
                  className="has-text-left p-2 fixed-grid has-background-white"
                  style={{
                    maxHeight: "calc(100vh - 300px)",
                    overflowY: "scroll",
                  }}
                >
                  <div>
                    <BookmarkList
                      bookmarks={bookmarks}
                      searchKeyword={searchKeyword}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Bookmarks;
