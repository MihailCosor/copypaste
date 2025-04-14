import React from 'react';

const ClipboardItem = ({ item, index, onCopy, onDelete }) => {
  // Function to handle "pop" action (copy then delete)
  const handlePop = () => {
    onCopy(item); // First copy the text
    // Then delete after a short delay to allow the copy to complete
    setTimeout(() => {
      onDelete(index);
    }, 200);
  };

  return (
    <>
      <div className="item-number">{index + 1}</div>
      <li className="item">
        <span className="item-text">{item}</span>
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