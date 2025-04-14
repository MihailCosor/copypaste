import React, { useRef, useEffect, useState } from 'react';

// Shared static variable to track cooldown state across all components
let isPopCooldown = false;

const ClipboardItem = ({ item, index, onCopy, onDelete }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const textRef = useRef(null);
  
  // Function to handle "pop" action (copy then delete)
  const handlePop = () => {
    // If in cooldown, don't allow another pop
    if (isPopCooldown) {
      return;
    }
    
    // Set cooldown to prevent rapid pops
    isPopCooldown = true;
    setIsInCooldown(true);
    
    // Copy the text but don't show toast for copy action
    navigator.clipboard.writeText(item)
      .then(() => {
        // Then delete after a short delay to allow the copy to complete
        setTimeout(() => {
          onDelete(index, true); // Pass true to indicate this is a pop action
          
          // Release cooldown after 1.5 seconds
          setTimeout(() => {
            isPopCooldown = false;
            setIsInCooldown(false);
          }, 500);
        }, 200);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Release cooldown if error
        isPopCooldown = false;
        setIsInCooldown(false);
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
            className={`icon-button pop-button ${isInCooldown ? 'cooldown' : ''}`}
            title={isInCooldown ? "Cooldown (1.5s)" : "Pop (copy & delete)"}
            disabled={isInCooldown}
          >
            <span className="material-icons">call_made</span>
          </button>
        </div>
      </li>
    </>
  );
};

export default ClipboardItem; 