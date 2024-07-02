import { faFolder, faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookmarkList = (props: { bookmarks: any, searchKeyword: any}) => {
  const { bookmarks, searchKeyword } = props;
  const drawTreeNodes = (bookmarkNodes: any) => {
    return (
      <div className="cell ml-4">
        {bookmarkNodes.map((bookmarkNode: any) => drawNode(bookmarkNode))}
      </div>
    );
  };

  const handleChangeBackgroundColor = (event: any) => {
    event.target.classList.toggle('has-background-link-light')
    event.target.classList.toggle('has-text-black')
    event.target.classList.toggle('has-text-link')
  };

  const drawNode = (bookmarkNode: any) => {
    const bookmarkTitle = bookmarkNode.title;
    const webLink = bookmarkNode.url;

    const match = searchKeyword
      ? new RegExp(searchKeyword, 'i').exec(bookmarkTitle) || new RegExp(searchKeyword, 'i').exec(webLink)
      : true;


    if (bookmarkTitle && match) {
      return (
        <div
          className={webLink ? "cell has-text-link p-1 is-widescreen" : "cell has-text-link"}
          key={bookmarkNode.id}
          style={{ cursor: 'pointer', margin: "1px 0", maxWidth: '900px' }}
          onClick={webLink && handleChangeBackgroundColor}
          onDoubleClick={() => {
            webLink && window.open(webLink, '_blank')
          }}
        >
          {webLink ?
            <FontAwesomeIcon icon={faBookBookmark} className={`mr-2`} /> :
            <FontAwesomeIcon icon={faFolder} className={`mr-2`} />
          }

          {bookmarkTitle}
          {bookmarkNode.children && bookmarkNode.children.length > 0 && drawTreeNodes(bookmarkNode.children)}
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
