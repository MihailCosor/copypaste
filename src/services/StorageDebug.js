/**
 * Debug utility for localStorage
 */

/**
 * Log all localStorage keys and values
 */
export const debugLocalStorage = () => {
  try {
    console.group('LocalStorage Debug');
    console.log('Available Keys:');
    
    // List all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      console.log(`- ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    }
    
    // Check clipboard items specifically
    const clipboardItems = localStorage.getItem('clipboardItems');
    console.log('\nClipboard Items:');
    console.log(clipboardItems ? JSON.parse(clipboardItems) : 'Not found');
    
    console.groupEnd();
    return true;
  } catch (error) {
    console.error('Error debugging localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available and working
 */
export const checkLocalStorageAvailability = () => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey) === 'test';
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
}; 