import { faFolder, faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookmarkList = (props: { bookmarks: any, searchKeyword: any}) => {
  const { bookmarks, searchKeyword } = props;
  const drawTreeNodes = (bookmarkNodes: any) => {
    return (
      <div className={bookmarkNodes.id ? `` : `ml-5`}>
        {bookmarkNodes.map((bookmarkNode: any) => drawNode(bookmarkNode))}
      </div>
    );
  };

  const drawNode = (bookmarkNode: any) => {
    const bookmarkTitle = bookmarkNode.title;
    const webLink = bookmarkNode.url;

    const match = searchKeyword
      ? new RegExp(searchKeyword, 'i').exec(bookmarkTitle) || new RegExp(searchKeyword, 'i').exec(webLink)
      : true;


    if (bookmarkTitle && match) {
      return (
        <div key={bookmarkNode.id} style={{display: bookmarkNode.id === '0' ? 'inline-flex' : ''}}>
          {webLink ?
            <FontAwesomeIcon icon={faBookBookmark} className={`mr-2`} /> :
            <FontAwesomeIcon icon={faFolder} className={`mr-2`} />
          }

          <a href={webLink} target="_blank" rel="noopener noreferrer" className="is-link">
            {bookmarkTitle}
          </a>
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
