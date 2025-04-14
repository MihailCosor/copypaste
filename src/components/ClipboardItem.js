import React, { useRef, useEffect, useState } from 'react';

const ClipboardItem = ({ item, index, onCopy, onDelete }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  
  // Function to handle "pop" action (copy then delete)
  const handlePop = () => {
    // Copy the text but don't show toast for copy action
    navigator.clipboard.writeText(item)
      .then(() => {
        // Then delete after a short delay to allow the copy to complete
        setTimeout(() => {
          onDelete(index, true); // Pass true to indicate this is a pop action
        }, 200);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  // Check if text is overflowing and needs truncation
  useEffect(() => {
    if (textRef.current) {
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTruncated(isOverflowing);
    }
  }, [item]);

  return (
    <>
      <div className="item-number">{index + 1}</div>
      <li className="item">
        <span 
          ref={textRef}
          className={`item-text ${isTruncated ? 'truncated' : ''}`}
          title={isTruncated ? item : ''}
        >
          {item}
        </span>
        <div className="button-group">
          <button 
            onClick={() => onCopy(item)} 
            className="icon-button copy-button"
            title="Copy to clipboard"
          >
            <span className="material-icons">content_copy</span>
          </button>
          <button 
            onClick={handlePop} 
            className="icon-button pop-button"
            title="Pop (copy & delete)"
          >
            <span className="material-icons">call_made</span>
          </button>
        </div>
      </li>
    </>
  );
};

export default ClipboardItem; 