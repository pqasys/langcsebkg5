// Debug script to inspect and clear design configuration
// Run this in your browser console on the /courses page

console.log('🔍 Design Configuration Debug Tool');
console.log('=====================================');

// Function to inspect current configuration
function inspectDesignConfig() {
  try {
    const savedConfig = localStorage.getItem('promotionalDesignConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      console.log('📋 Current Design Configuration:');
      console.log(config);
      
      // Check for problematic background images
      if (config.backgroundImage) {
        console.log('⚠️  PROBLEMATIC BACKGROUND IMAGE FOUND:');
        console.log('   URL:', config.backgroundImage);
        console.log('   Type:', config.backgroundType);
        
        const isInstitutionLogo = 
          config.backgroundImage.includes('logo') ||
          config.backgroundImage.includes('institution') ||
          config.backgroundImage.includes('uploads/logos') ||
          config.backgroundImage.includes('uploads/');
        
        if (isInstitutionLogo) {
          console.log('🚨 CONFIRMED: This appears to be an institution logo!');
        }
      }
    } else {
      console.log('✅ No saved configuration found in localStorage');
    }
  } catch (error) {
    console.error('❌ Error reading configuration:', error);
  }
}

// Function to clear the configuration
function clearDesignConfig() {
  try {
    localStorage.removeItem('promotionalDesignConfig');
    console.log('🗑️  Design configuration cleared from localStorage');
    console.log('🔄 Please refresh the page to see changes');
  } catch (error) {
    console.error('❌ Error clearing configuration:', error);
  }
}

// Function to reset to safe defaults
function resetToSafeDefaults() {
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
    console.log('✅ Reset to safe defaults');
    console.log('🔄 Please refresh the page to see changes');
  } catch (error) {
    console.error('❌ Error setting safe defaults:', error);
  }
}

// Make functions available globally
window.inspectDesignConfig = inspectDesignConfig;
window.clearDesignConfig = clearDesignConfig;
window.resetToSafeDefaults = resetToSafeDefaults;

console.log('📝 Available commands:');
console.log('   inspectDesignConfig() - View current configuration');
console.log('   clearDesignConfig()   - Remove configuration entirely');
console.log('   resetToSafeDefaults() - Reset to safe defaults');
console.log('');
console.log('🚀 Run inspectDesignConfig() to start debugging...');
