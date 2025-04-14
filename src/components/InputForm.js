import React from 'react';

const InputForm = ({ newItem, setNewItem, handleAddItem, handleKeyDown }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter text..."
        className="text-input"
      />
      <button onClick={handleAddItem} className="add-button">
        Add
      </button>
    </div>
  );
};

export default InputForm; 