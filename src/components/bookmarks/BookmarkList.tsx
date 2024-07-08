/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import { faBookBookmark, faThumbtack, faTrash, faShuffle, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setStorage } from "../../utils";
import { useFormContext } from "../../contexts/FormContext";

const BookmarkList = (props: { bookmarks: any, searchKeyword: any}) => {
  const { bookmarks, searchKeyword } = props;
  const { formData } = useFormContext();

  const drawTreeNodes = (bookmarkNodes: any) => {
    return (
      <div className="cell ml-4">
        {bookmarkNodes.map((bookmarkNode: any) => drawNode(bookmarkNode))}
      </div>
    );
  };

  const handleChangeBackgroundColor = (event: any) => {
    let eventTarget = event.target;
    if (!eventTarget.classList.contains('cell')) {
      eventTarget = event.target.closest('.cell')
    }

    eventTarget.classList.toggle('has-background-link-light')
    eventTarget.classList.toggle('has-text-black')
    eventTarget.classList.toggle('has-text-link')
  };

  const handleDeleteBookmark = (bookmarkId: string, event: any) => {
    chrome.bookmarks.remove(bookmarkId, () => {
      if (chrome.runtime.lastError) {
        console.log(`Error: ${chrome.runtime.lastError.message}`);
      } else {
        event.target.closest('.cell').remove();

        handleUnPinBookmark(bookmarkId, undefined)
      }
    });
  }

  const handlePinBookmark = (bookmarkId: string, event: any) => {
    let pinBookmarks = formData.pinBookmarks;
    pinBookmarks.push(bookmarkId)

    setStorage({ pinBookmarks }, () => {
      formData.pinBookmarks = pinBookmarks;
    });

    if (event) {
      const parent = event.target.closest('.actions-bar');

      const shuffleIcon = parent.querySelector('.shuffle');
      shuffleIcon && shuffleIcon.classList.toggle('is-hidden');

      const thumbtackIcon = parent.querySelector('.thumbtack');
      thumbtackIcon && thumbtackIcon.classList.toggle('is-hidden');
    }
  }

  const handleUnPinBookmark = (bookmarkId: string, event: any) => {
    let pinBookmarks = formData.pinBookmarks;
    const newPinBookmarks = pinBookmarks.filter(id => id !== bookmarkId)

    setStorage({ pinBookmarks: newPinBookmarks }, () => {
      formData.pinBookmarks = newPinBookmarks;
    });

    if (event) {
      const parent = event.target.closest('.actions-bar');

      const shuffleIcon = parent.querySelector('.shuffle');
      shuffleIcon && shuffleIcon.classList.toggle('is-hidden');

      const thumbtackIcon = parent.querySelector('.thumbtack');
      thumbtackIcon && thumbtackIcon.classList.toggle('is-hidden');
    }
  }

  const drawNode = (bookmarkNode: any) => {
    const bookmarkTitle = bookmarkNode.title;
    const webLink = bookmarkNode.url;

    const match = searchKeyword
      ? new RegExp(searchKeyword, 'i').exec(bookmarkTitle) || new RegExp(searchKeyword, 'i').exec(webLink)
      : true;

    if (bookmarkTitle && match && (webLink || (bookmarkNode.children && bookmarkNode.children.length > 0))) {
      return (
        <div
          className={
            webLink ? `cell has-text-link p-1 is-widescreen` : `cell has-text-link`
          }
          key={bookmarkNode.id}
          style={{ cursor: 'pointer', margin: "1px 0", wordBreak: "break-all", position: "relative" }}
          onMouseOver={webLink && handleChangeBackgroundColor}
          onMouseOut={webLink && handleChangeBackgroundColor}
          onDoubleClick={() => {
            webLink && window.open(webLink, '_blank')
          }}
        >
          {webLink ?
            <FontAwesomeIcon icon={faBookBookmark} className={`mr-2`} /> :
            <FontAwesomeIcon icon={faFolderOpen} className={`mr-2`} />
          }

          {bookmarkTitle} {bookmarkNode.children && bookmarkNode.children.length > 0 ? `(${bookmarkNode.children.length})` : ''}
          {bookmarkNode.children && bookmarkNode.children.length > 0 && drawTreeNodes(bookmarkNode.children)}

          {webLink &&
            <div
              className="is-pulled-right pl-3 actions-bar"
              style={{ position: "absolute", top: "5px", right: "5px", zIndex: 1 }}
            >
              <FontAwesomeIcon
                icon={faThumbtack}
                onClick={(event) => handlePinBookmark(bookmarkNode.id, event)}
                className={formData.pinBookmarks.includes(bookmarkNode.id) ? "is-hidden mt-1 mr-3 thumbtack" : "mt-1 mr-3 thumbtack"}
                onMouseOver={webLink && handleChangeBackgroundColor}
                onMouseOut={webLink && handleChangeBackgroundColor}
              />
              <FontAwesomeIcon
                icon={faShuffle}
                onClick={(event) => handleUnPinBookmark(bookmarkNode.id, event)}
                className={formData.pinBookmarks.includes(bookmarkNode.id) ? "mt-1 mr-3 shuffle" : "is-hidden mt-1 mr-3 shuffle"}
                onMouseOver={webLink && handleChangeBackgroundColor}
                onMouseOut={webLink && handleChangeBackgroundColor}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="mt-1 mr-3"
                onClick={(event) => handleDeleteBookmark(bookmarkNode.id, event)}
                onMouseOver={webLink && handleChangeBackgroundColor}
                onMouseOut={webLink && handleChangeBackgroundColor}
            />
          </div>}
        </div>
      );
    } else if (bookmarkNode.children && bookmarkNode.children.length > 0) {
      return drawTreeNodes(bookmarkNode.children)
    } else {
      return null;
    }
  };

  return drawTreeNodes(bookmarks);
};

export default BookmarkList;
