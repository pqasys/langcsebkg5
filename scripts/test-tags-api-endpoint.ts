async function testTagsAPIEndpoint() {
  try {
    console.log('Testing Tags API Endpoint...');
    
    // Test the actual API endpoint
    const response = await fetch('/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log(`API Response Status: ${response.status}`);
    console.log(`API Response Headers:`, response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log(`API Response Data Type: ${typeof data}`);
    console.log(`API Response Data Length: ${Array.isArray(data) ? data.length : 'Not an array'}`);
    
    if (Array.isArray(data)) {
      console.log(`✅ API returned ${data.length} tags`);
      if (data.length > 0) {
        console.log('First tag:', data[0]);
        console.log('Sample tags:');
        data.slice(0, 3).forEach((tag, index) => {
          console.log(`  ${index + 1}. ${tag.name} (${tag.id})`);
        });
      }
    } else {
      console.log('❌ API did not return an array');
      console.log('Actual response:', data);
    }
    
    // Test with different parameters
    console.log('\n=== Testing with different parameters ===');
    
    // Test with search
    const searchResponse = await fetch('/api/tags?search=beginner', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`Search results: ${Array.isArray(searchData) ? searchData.length : 'Not array'} tags`);
    }
    
    // Test with featured
    const featuredResponse = await fetch('/api/tags?featured=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json();
      console.log(`Featured results: ${Array.isArray(featuredData) ? featuredData.length : 'Not array'} tags`);
    }
    
    console.log('\n✅ Tags API endpoint test completed!');
    
  } catch (error) {
    console.error('Error testing tags API endpoint:', error);
  }
}

testTagsAPIEndpoint(); 