import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import DraggableItem from './components/DraggableItem';
import InputForm from './components/InputForm';
import ProfileSelector from './components/ProfileSelector';
import ToastManager from './components/ToastManager';
import { 
  getProfiles, 
  getActiveProfileId, 
  setActiveProfileId, 
  createProfile, 
  deleteProfile, 
  getProfileItems, 
  saveProfileItems 
} from './services/ClipboardService';
import { checkLocalStorageAvailability, debugLocalStorage } from './services/StorageDebug';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState('default');
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

  // Load profiles and active profile ID
  useEffect(() => {
    if (storageAvailable) {
      const allProfiles = getProfiles();
      const activeId = getActiveProfileId();
      
      setProfiles(allProfiles);
      setActiveProfileId(activeId);
      
      // Debug localStorage content
      debugLocalStorage();
      
      setIsInitialized(true);
    }
  }, [storageAvailable]);

  // Load items for the active profile
  useEffect(() => {
    if (isInitialized && storageAvailable) {
      const profileItems = getProfileItems(activeProfileId);
      setItems(profileItems);
    }
  }, [activeProfileId, isInitialized, storageAvailable]);

  // Handle profile selection
  const handleSelectProfile = (profileId) => {
    setActiveProfileId(profileId);
    showToast(`Switched to "${profiles.find(p => p.id === profileId)?.name}"`, 1500);
  };

  // Handle profile creation
  const handleCreateProfile = (name) => {
    const newProfile = createProfile(name);
    if (newProfile) {
      setProfiles([...profiles, newProfile]);
      setActiveProfileId(newProfile.id);
      showToast(`Created new list "${name}"`, 1500);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = (profileId) => {
    const profileName = profiles.find(p => p.id === profileId)?.name;
    if (deleteProfile(profileId)) {
      setProfiles(profiles.filter(p => p.id !== profileId));
      showToast(`Deleted list "${profileName}"`, 1500);
      
      // If the active profile was deleted, activeProfileId gets set to 'default'
      // in the deleteProfile function, so we should update our local state
      if (activeProfileId === profileId) {
        setActiveProfileId('default');
      }
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newItems = [...items, newItem];
      setItems(newItems);
      setNewItem('');
      
      // Save to the active profile
      if (storageAvailable) {
        saveProfileItems(newItems, activeProfileId);
        
        // Update the profiles list with the new item count
        setProfiles(profiles.map(profile => 
          profile.id === activeProfileId 
            ? { ...profile, items: newItems } 
            : profile
        ));
      }
    }
  };

  const handleDeleteItem = (index, isPop = false) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    // Save to the active profile
    if (storageAvailable) {
      saveProfileItems(updatedItems, activeProfileId);
      
      // Update the profiles list with the new item count
      setProfiles(profiles.map(profile => 
        profile.id === activeProfileId 
          ? { ...profile, items: updatedItems } 
          : profile
      ));
    }
    
    // Only show toast notification if this is a pop action
    if (isPop) {
      showToast('Item popped (copied & removed)!', 1500);
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

  // Callback for reordering items using drag and drop
  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const dragItem = newItems[dragIndex];
      
      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      // Insert it at the new position
      newItems.splice(hoverIndex, 0, dragItem);
      
      // Save to the active profile
      if (storageAvailable) {
        saveProfileItems(newItems, activeProfileId);
        
        // Update the profiles list with the new items arrangement
        setProfiles(prevProfiles => 
          prevProfiles.map(profile => 
            profile.id === activeProfileId 
              ? { ...profile, items: newItems } 
              : profile
          )
        );
      }
      
      return newItems;
    });
  }, [storageAvailable, activeProfileId, setProfiles]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="content">
          <div className="header-container">
            <div className="header-left">
              <h1>Clipboard Manager</h1>
              <p className="app-description">
                Save, organize, and copy text snippets with ease.
              </p>
            </div>
            
            <div className="header-right">
              {/* No toggle button as per the updated instructions */}
            </div>
          </div>
          
          <div className="main-container">
            <div className="sidebar">
              <ProfileSelector 
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onDeleteProfile={handleDeleteProfile}
              />
            </div>
            
            <div className="main-content">
              {!storageAvailable && (
                <div className="storage-warning">
                  Warning: LocalStorage is not available. Your items won't be saved between sessions.
                </div>
              )}
              
              <div className="active-profile-indicator">
                Current List: <strong>{profiles.find(p => p.id === activeProfileId)?.name || 'Default'}</strong>
              </div>
              
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
            </div>
          </div>
          
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
