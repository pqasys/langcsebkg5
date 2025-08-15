// Comprehensive Background Logo Fix Script
// Run this in your browser console on the /courses page

console.log('🔧 COMPREHENSIVE BACKGROUND LOGO FIX');
console.log('=====================================');

// Function to completely clear all design configurations
function nuclearClear() {
  try {
    // Clear all possible localStorage keys
    const keysToClear = [
      'promotionalDesignConfig',
      'designConfig',
      'backgroundConfig',
      'sidebarConfig',
      'promoConfig'
    ];
    
    keysToClear.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared: ${key}`);
      }
    });
    
    // Clear sessionStorage as well
    keysToClear.forEach(key => {
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        console.log(`🗑️ Cleared sessionStorage: ${key}`);
      }
    });
    
    // Force reload the page
    console.log('🔄 Reloading page...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error during nuclear clear:', error);
  }
}

// Function to inspect what's currently in storage
function inspectAllStorage() {
  console.log('🔍 INSPECTING ALL STORAGE:');
  console.log('==========================');
  
  // Check localStorage
  console.log('📦 localStorage contents:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value}`);
  }
  
  // Check sessionStorage
  console.log('📦 sessionStorage contents:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`  ${key}: ${value}`);
  }
  
  // Check for any design-related keys
  const allKeys = [...Array.from({length: localStorage.length}, (_, i) => localStorage.key(i)),
                   ...Array.from({length: sessionStorage.length}, (_, i) => sessionStorage.key(i))];
  
  const designKeys = allKeys.filter(key => 
    key && (key.includes('design') || key.includes('config') || key.includes('promo') || key.includes('background'))
  );
  
  if (designKeys.length > 0) {
    console.log('⚠️ DESIGN-RELATED KEYS FOUND:');
    designKeys.forEach(key => {
      const value = localStorage.getItem(key) || sessionStorage.getItem(key);
      console.log(`  ${key}: ${value}`);
    });
  } else {
    console.log('✅ No design-related keys found');
  }
}

// Function to force reset the component state
function forceComponentReset() {
  try {
    // Try to find and reset any React components
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔧 React DevTools detected - attempting component reset');
    }
    
    // Clear any cached data
    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
          console.log(`🗑️ Cleared cache: ${name}`);
        });
      });
    }
    
    // Force a hard reload
    console.log('🔄 Force reloading page...');
    window.location.href = window.location.href;
    
  } catch (error) {
    console.error('❌ Error during component reset:', error);
  }
}

// Function to set safe defaults
function setSafeDefaults() {
  try {
    const safeConfig = {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      titleAlignment: {
        horizontal: 'left',
        vertical: 'top',
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      },
      descriptionAlignment: {
        horizontal: 'left',
        vertical: 'top',
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      }
    };
    
    localStorage.setItem('promotionalDesignConfig', JSON.stringify(safeConfig));
    console.log('✅ Set safe defaults');
    console.log('🔄 Reloading page...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error setting safe defaults:', error);
  }
}

// Make functions available globally
window.nuclearClear = nuclearClear;
window.inspectAllStorage = inspectAllStorage;
window.forceComponentReset = forceComponentReset;
window.setSafeDefaults = setSafeDefaults;

console.log('📝 Available commands:');
console.log('   inspectAllStorage() - Check all storage for design configs');
console.log('   nuclearClear()      - Clear ALL possible design configs');
console.log('   setSafeDefaults()   - Set safe defaults and reload');
console.log('   forceComponentReset() - Force component reset');
console.log('');
console.log('🚀 Run inspectAllStorage() first to see what\'s causing the issue...');
