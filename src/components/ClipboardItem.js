import React from 'react';

const ClipboardItem = ({ item, index, onCopy, onDelete }) => {
  return (
    <div className="item-container">
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
            onClick={() => onDelete(index)} 
            className="icon-button delete-button"
            title="Delete"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      </li>
    </div>
  );
};

export default ClipboardItem; 