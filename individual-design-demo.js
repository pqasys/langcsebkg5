// Individual Design System Demonstration
// Run this in your browser console on the /courses page

console.log('🎨 INDIVIDUAL DESIGN SYSTEM DEMO');
console.log('================================');

// Function to demonstrate individual design configurations
function demonstrateIndividualDesigns() {
  console.log('📋 Available Individual Design Functions:');
  console.log('');
  
  console.log('1. 📝 Check Current Individual Configs:');
  console.log('   inspectIndividualConfigs()');
  console.log('');
  
  console.log('2. 🎨 Set Custom Design for Specific Item:');
  console.log('   setItemDesign("institution-1", {');
  console.log('     backgroundType: "gradient",');
  console.log('     backgroundGradient: {');
  console.log('       from: "#667eea",');
  console.log('       to: "#764ba2",');
  console.log('       direction: "to-r"');
  console.log('     },');
  console.log('     titleColor: "#ffffff",');
  console.log('     titleSize: 20');
  console.log('   })');
  console.log('');
  
  console.log('3. 🖼️ Set Background Image for Course Item:');
  console.log('   setItemDesign("course-1", {');
  console.log('     backgroundType: "image",');
  console.log('     backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",');
  console.log('     backgroundOpacity: 70,');
  console.log('     titleColor: "#ffffff",');
  console.log('     titleShadow: true');
  console.log('   })');
  console.log('');
  
  console.log('4. 🔄 Reset Specific Item Design:');
  console.log('   resetItemDesign("institution-1")');
  console.log('');
  
  console.log('5. 🗑️ Clear All Individual Designs:');
  console.log('   clearAllIndividualDesigns()');
  console.log('');
  
  console.log('6. 📊 Show Design Statistics:');
  console.log('   showDesignStats()');
  console.log('');
}

// Function to inspect current individual design configurations
function inspectIndividualConfigs() {
  try {
    const configs = localStorage.getItem('individualDesignConfigs');
    if (configs) {
      const parsed = JSON.parse(configs);
      console.log('📦 Current Individual Design Configurations:');
      console.log('============================================');
      Object.keys(parsed).forEach(itemId => {
        console.log(`\n🎯 Item: ${itemId}`);
        console.log(`   Background Type: ${parsed[itemId].backgroundType}`);
        console.log(`   Title Color: ${parsed[itemId].titleColor}`);
        console.log(`   Title Size: ${parsed[itemId].titleSize}px`);
        if (parsed[itemId].backgroundImage) {
          console.log(`   Background Image: ${parsed[itemId].backgroundImage}`);
        }
      });
    } else {
      console.log('✅ No individual design configurations found');
    }
  } catch (error) {
    console.error('❌ Error inspecting configs:', error);
  }
}

// Function to set design for a specific item
function setItemDesign(itemId, designUpdates) {
  try {
    const configs = localStorage.getItem('individualDesignConfigs');
    const currentConfigs = configs ? JSON.parse(configs) : {};
    
    // Get existing config or use default
    const existingConfig = currentConfigs[itemId] || {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      backgroundGradient: { from: '#667eea', to: '#764ba2', direction: 'to-r' },
      backgroundImage: '',
      backgroundOpacity: 100,
      titleFont: 'inter',
      titleSize: 16,
      titleWeight: 'semibold',
      titleColor: '#1f2937',
      titleAlignment: { horizontal: 'left', vertical: 'top', padding: { top: 0, bottom: 0, left: 0, right: 0 } },
      titleShadow: false,
      titleShadowColor: '#000000',
      descriptionFont: 'inter',
      descriptionSize: 14,
      descriptionColor: '#6b7280',
      descriptionAlignment: { horizontal: 'left', vertical: 'top', padding: { top: 0, bottom: 0, left: 0, right: 0 } },
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 10,
      shadowOffset: 4,
      hoverEffect: 'scale',
      animationDuration: 300,
      customCSS: ''
    };
    
    // Merge updates
    const updatedConfig = { ...existingConfig, ...designUpdates };
    currentConfigs[itemId] = updatedConfig;
    
    // Save to localStorage
    localStorage.setItem('individualDesignConfigs', JSON.stringify(currentConfigs));
    
    console.log(`✅ Set design for item: ${itemId}`);
    console.log('Updated properties:', Object.keys(designUpdates));
    
    // Reload page to see changes
    console.log('🔄 Reloading page to apply changes...');
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Error setting item design:', error);
  }
}

// Function to reset design for a specific item
function resetItemDesign(itemId) {
  try {
    const configs = localStorage.getItem('individualDesignConfigs');
    if (configs) {
      const currentConfigs = JSON.parse(configs);
      delete currentConfigs[itemId];
      localStorage.setItem('individualDesignConfigs', JSON.stringify(currentConfigs));
      console.log(`🔄 Reset design for item: ${itemId}`);
      console.log('🔄 Reloading page...');
      window.location.reload();
    } else {
      console.log('✅ No configurations to reset');
    }
  } catch (error) {
    console.error('❌ Error resetting item design:', error);
  }
}

// Function to clear all individual designs
function clearAllIndividualDesigns() {
  try {
    localStorage.removeItem('individualDesignConfigs');
    console.log('🗑️ Cleared all individual design configurations');
    console.log('🔄 Reloading page...');
    window.location.reload();
  } catch (error) {
    console.error('❌ Error clearing designs:', error);
  }
}

// Function to show design statistics
function showDesignStats() {
  try {
    const configs = localStorage.getItem('individualDesignConfigs');
    if (configs) {
      const parsed = JSON.parse(configs);
      const itemCount = Object.keys(parsed).length;
      
      console.log('📊 Individual Design Statistics:');
      console.log('===============================');
      console.log(`Total items with custom designs: ${itemCount}`);
      
      const backgroundTypes = {};
      const titleColors = {};
      
      Object.values(parsed).forEach(config => {
        backgroundTypes[config.backgroundType] = (backgroundTypes[config.backgroundType] || 0) + 1;
        titleColors[config.titleColor] = (titleColors[config.titleColor] || 0) + 1;
      });
      
      console.log('\nBackground Types:');
      Object.entries(backgroundTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      
      console.log('\nTitle Colors:');
      Object.entries(titleColors).forEach(([color, count]) => {
        console.log(`  ${color}: ${count}`);
      });
      
    } else {
      console.log('📊 No individual designs found');
    }
  } catch (error) {
    console.error('❌ Error showing stats:', error);
  }
}

// Make functions available globally
window.demonstrateIndividualDesigns = demonstrateIndividualDesigns;
window.inspectIndividualConfigs = inspectIndividualConfigs;
window.setItemDesign = setItemDesign;
window.resetItemDesign = resetItemDesign;
window.clearAllIndividualDesigns = clearAllIndividualDesigns;
window.showDesignStats = showDesignStats;

// Auto-run demonstration
demonstrateIndividualDesigns();

console.log('🚀 Ready! Use the functions above to test individual designs.');
console.log('💡 Start with: demonstrateIndividualDesigns()');
