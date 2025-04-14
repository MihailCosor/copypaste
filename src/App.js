import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import DraggableItem from './components/DraggableItem';
import InputForm from './components/InputForm';
import ToastManager from './components/ToastManager';
import { saveItems, loadItems } from './services/ClipboardService';
import { checkLocalStorageAvailability, debugLocalStorage } from './services/StorageDebug';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const { toastContainerJSX, showToast } = ToastManager();

  // Check if localStorage is available
  useEffect(() => {
    const available = checkLocalStorageAvailability();
    setStorageAvailable(available);
    
    if (!available) {
      console.error('localStorage is not available in this browser');
    }
  }, []);

  // Load items from localStorage on initial render
  useEffect(() => {
    if (storageAvailable) {
      const storedItems = loadItems();
      setItems(storedItems);
      
      // Debug localStorage content
      debugLocalStorage();
      
      setIsInitialized(true);
    }
  }, [storageAvailable]);

  // Save items to localStorage whenever the items array changes
  useEffect(() => {
    // Only save if component has been initialized and storage is available
    if (isInitialized && storageAvailable) {
      const saveSuccess = saveItems(items);
      
      if (!saveSuccess) {
        console.warn('Failed to save items to localStorage');
      }
    }
  }, [items, isInitialized, storageAvailable]);

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newItems = [...items, newItem];
      setItems(newItems);
      setNewItem('');
      
      // Force immediate save to localStorage
      if (storageAvailable) {
        saveItems(newItems);
        debugLocalStorage();
      }
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    // Force immediate save to localStorage
    if (storageAvailable) {
      saveItems(updatedItems);
    }
    
    // Show toast notification for pop action (already copied, now deleted)
    showToast('Item popped (copied & removed)!', 1500);
  };

  const handleCopyItem = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show toast notification
        showToast('Copied to clipboard!', 1500);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy to clipboard', 1500);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  // Callback for reordering items using drag and drop
  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const dragItem = newItems[dragIndex];
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      // Insert it at the new position
      newItems.splice(hoverIndex, 0, dragItem);
      
      // Force save after reordering
      if (storageAvailable) {
        saveItems(newItems);
      }
      
      return newItems;
    });
  }, [storageAvailable]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="content">
          <h1>Clipboard Manager</h1>
          <p className="app-description">
            Save, organize, and copy text snippets with ease.
          </p>
          
          {!storageAvailable && (
            <div className="storage-warning">
              Warning: LocalStorage is not available. Your items won't be saved between sessions.
            </div>
          )}
          
          <InputForm 
            newItem={newItem}
            setNewItem={setNewItem}
            handleAddItem={handleAddItem}
            handleKeyDown={handleKeyDown}
          />

          <ul className="items-list">
            {items.map((item, index) => (
              <DraggableItem 
                key={index}
                index={index}
                item={item}
                onCopy={handleCopyItem}
                onDelete={handleDeleteItem}
                moveItem={moveItem}
              />
            ))}
          </ul>
          
          {toastContainerJSX}
        </div>
        
        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} <a 
              href="https://github.com/mihailcosor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              Mihail Cosor
            </a>
          </p>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
