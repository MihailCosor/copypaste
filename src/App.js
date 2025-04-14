import { useState, useEffect } from 'react';
import './App.css';
import ClipboardItem from './components/ClipboardItem';
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

  return (
    <div className="App">
      <h1>Clipboard Manager</h1>
      
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
          <ClipboardItem 
            key={index}
            item={item}
            index={index}
            onCopy={handleCopyItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
      
      {toastContainerJSX}
    </div>
  );
}

export default App;
