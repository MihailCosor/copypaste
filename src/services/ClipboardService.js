const PROFILES_KEY = 'clipboardProfiles';
const ACTIVE_PROFILE_KEY = 'clipboardActiveProfile';

/**
 * Get all clipboard profiles
 * @returns {Array} - Array of profile objects
 */
export const getProfiles = () => {
  try {
    const storedProfiles = localStorage.getItem(PROFILES_KEY);
    
    if (!storedProfiles) {
      // Create a default profile if none exists
      const defaultProfile = { id: 'default', name: 'Default List', items: [] };
      saveProfiles([defaultProfile]);
      return [defaultProfile];
    }
    
    const parsedProfiles = JSON.parse(storedProfiles);
    return Array.isArray(parsedProfiles) ? parsedProfiles : []; 
  } catch (error) {
    console.error('Error loading profiles from localStorage:', error);
    return [];
  }
};

/**
 * Save all clipboard profiles
 * @param {Array} profiles - Array of profile objects
 * @returns {boolean} - Success status
 */
export const saveProfiles = (profiles) => {
  try {
    const profilesToSave = Array.isArray(profiles) ? profiles : [];
    const profilesJson = JSON.stringify(profilesToSave);
    
    localStorage.setItem(PROFILES_KEY, profilesJson);
    return localStorage.getItem(PROFILES_KEY) === profilesJson;
  } catch (error) {
    console.error('Error saving profiles to localStorage:', error);
    return false;
  }
};

/**
 * Get active profile ID
 * @returns {string} - Active profile ID
 */
export const getActiveProfileId = () => {
  try {
    const activeProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    return activeProfileId || 'default';
  } catch (error) {
    console.error('Error getting active profile ID:', error);
    return 'default';
  }
};

/**
 * Set active profile ID
 * @param {string} profileId - Profile ID to set as active
 * @returns {boolean} - Success status
 */
export const setActiveProfileId = (profileId) => {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    return localStorage.getItem(ACTIVE_PROFILE_KEY) === profileId;
  } catch (error) {
    console.error('Error setting active profile ID:', error);
    return false;
  }
};

/**
 * Create a new profile
 * @param {string} name - Profile name
 * @returns {object|null} - New profile object or null on failure
 */
export const createProfile = (name) => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return null;
    }
    
    const profiles = getProfiles();
    const id = `profile-${Date.now()}`;
    const newProfile = { id, name: name.trim(), items: [] };
    
    profiles.push(newProfile);
    saveProfiles(profiles);
    
    return newProfile;
  } catch (error) {
    console.error('Error creating new profile:', error);
    return null;
  }
};

/**
 * Delete a profile
 * @param {string} profileId - Profile ID to delete
 * @returns {boolean} - Success status
 */
export const deleteProfile = (profileId) => {
  try {
    if (profileId === 'default') {
      return false; // Cannot delete the default profile
    }
    
    const profiles = getProfiles();
    const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
    
    if (profiles.length === updatedProfiles.length) {
      return false; // Profile not found
    }
    
    // If deleting the active profile, switch to default
    const activeId = getActiveProfileId();
    if (activeId === profileId) {
      setActiveProfileId('default');
    }
    
    return saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
};

/**
 * Get items for a specific profile
 * @param {string} profileId - Profile ID to get items for
 * @returns {Array} - Array of clipboard items
 */
export const getProfileItems = (profileId = null) => {
  try {
    const targetProfileId = profileId || getActiveProfileId();
    const profiles = getProfiles();
    
    const profile = profiles.find(p => p.id === targetProfileId);
    if (!profile) {
      return [];
    }
    
    return Array.isArray(profile.items) ? profile.items : [];
  } catch (error) {
    console.error('Error getting profile items:', error);
    return [];
  }
};

/**
 * Save items for a specific profile
 * @param {Array} items - Array of clipboard items
 * @param {string} profileId - Profile ID to save items for
 * @returns {boolean} - Success status
 */
export const saveProfileItems = (items, profileId = null) => {
  try {
    const targetProfileId = profileId || getActiveProfileId();
    const profiles = getProfiles();
    
    const itemsToSave = Array.isArray(items) ? items : [];
    let profileFound = false;
    
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === targetProfileId) {
        profileFound = true;
        return { ...profile, items: itemsToSave };
      }
      return profile;
    });
    
    if (!profileFound) {
      return false;
    }
    
    return saveProfiles(updatedProfiles);
  } catch (error) {
    console.error('Error saving profile items:', error);
    return false;
  }
};

// Old functions kept for backward compatibility
export const saveItems = (items) => {
  return saveProfileItems(items);
};

export const loadItems = () => {
  return getProfileItems();
}; 