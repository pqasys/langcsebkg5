import fetch from 'node-fetch';

async function testLiveAPI() {
  console.log('🌐 Testing Live API Endpoint\n');

  try {
    // Wait a moment for the server to start
    console.log('Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test the public API endpoint
    console.log('Testing /api/design-configs/public...');
    
    const response = await fetch('http://localhost:3000/api/design-configs/public');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API responded successfully with ${data.configs.length} designs`);
      
      // Filter for courses page designs
      const coursesPageDesigns = data.configs.filter((config: any) => 
        ['premium-course-banner', 'featured-institution-banner', 'promotional-banner'].includes(config.itemId)
      );
      
      console.log(`📋 Courses page designs returned: ${coursesPageDesigns.length}`);
      
      coursesPageDesigns.forEach((design: any) => {
        console.log(`\n   🎨 ${design.name} (${design.itemId}):`);
        console.log(`      Background: ${design.backgroundType} (${design.backgroundGradientFrom} → ${design.backgroundGradientTo})`);
        console.log(`      Opacity: ${design.backgroundOpacity}%`);
        console.log(`      Title: ${design.titleSize}px ${design.titleWeight} ${design.titleColor}`);
        console.log(`      Description: ${design.descriptionSize}px ${design.descriptionColor}`);
      });
      
      // Verify the designs match the original styling
      const expectedDesigns = {
        'premium-course-banner': {
          backgroundGradientFrom: '#8b5cf6',
          backgroundGradientTo: '#ec4899',
          backgroundOpacity: 10,
          titleColor: '#111827',
          titleSize: 20,
          titleWeight: 'bold',
          descriptionColor: '#4b5563',
          descriptionSize: 14
        },
        'featured-institution-banner': {
          backgroundGradientFrom: '#f97316',
          backgroundGradientTo: '#ef4444',
          backgroundOpacity: 10,
          titleColor: '#111827',
          titleSize: 20,
          titleWeight: 'bold',
          descriptionColor: '#4b5563',
          descriptionSize: 14
        },
        'promotional-banner': {
          backgroundGradientFrom: '#10b981',
          backgroundGradientTo: '#059669',
          backgroundOpacity: 10,
          titleColor: '#111827',
          titleSize: 20,
          titleWeight: 'bold',
          descriptionColor: '#4b5563',
          descriptionSize: 14
        }
      };
      
      console.log('\n🎯 Verifying Original Styling Match:');
      
      let allMatch = true;
      coursesPageDesigns.forEach((design: any) => {
        const expected = expectedDesigns[design.itemId as keyof typeof expectedDesigns];
        
        if (expected) {
          const matches = 
            design.backgroundGradientFrom === expected.backgroundGradientFrom &&
            design.backgroundGradientTo === expected.backgroundGradientTo &&
            design.backgroundOpacity === expected.backgroundOpacity &&
            design.titleColor === expected.titleColor &&
            design.titleSize === expected.titleSize &&
            design.titleWeight === expected.titleWeight &&
            design.descriptionColor === expected.descriptionColor &&
            design.descriptionSize === expected.descriptionSize;
          
          console.log(`   ${design.itemId}: ${matches ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
          
          if (!matches) {
            allMatch = false;
            console.log(`      Expected: ${expected.backgroundGradientFrom} → ${expected.backgroundGradientTo}, ${expected.backgroundOpacity}%`);
            console.log(`      Actual: ${design.backgroundGradientFrom} → ${design.backgroundGradientTo}, ${design.backgroundOpacity}%`);
          }
        }
      });
      
      if (allMatch && coursesPageDesigns.length === 3) {
        console.log('\n🎉 SUCCESS: Live API is working correctly!');
        console.log('The banners should display with their original styling on the frontend.');
      } else {
        console.log('\n❌ ISSUE: Live API is not returning the expected data.');
      }
      
    } else {
      console.log(`❌ API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing live API:', error);
    console.log('Make sure the development server is running on port 3000');
  }
}

// Run the test
testLiveAPI();
