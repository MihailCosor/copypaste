const STORAGE_KEY = 'clipboardItems';

/**
 * Save items to localStorage
 * @param {Array} items - Array of clipboard items
 * @returns {boolean} - Success status
 */
export const saveItems = (items) => {
  try {
    // Make sure we're working with a valid array
    const itemsToSave = Array.isArray(items) ? items : [];
    
    // Stringify with null replacer and 2 spaces for debugging
    const itemsJson = JSON.stringify(itemsToSave);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, itemsJson);
    
    // Verify the save was successful
    return localStorage.getItem(STORAGE_KEY) === itemsJson;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load items from localStorage
 * @returns {Array} - Array of clipboard items
 */
export const loadItems = () => {
  try {
    // Get items from localStorage
    const storedItems = localStorage.getItem(STORAGE_KEY);
    
    // If nothing found or invalid, return empty array
    if (!storedItems) {
      return [];
    }
    
    // Parse the JSON
    const parsedItems = JSON.parse(storedItems);
    
    // Ensure we're returning an array
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}; 