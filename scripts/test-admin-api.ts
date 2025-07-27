import fetch from 'node-fetch';
import { logger } from '../lib/logger';

async function testAdminApi() {
  try {
    console.log('Testing Admin API response for ABC School of English...\\n');

    const institutionId = 'c5962019-07ca-4a78-a97f-3cf394e5bf94';
    
    const response = await fetch(`http://localhost:3000/api/admin/institutions/${institutionId}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.error) {
      console.log('Error from API:', data.error);
      return;
    }
    
    console.log('\\nAdmin API Response:');
    console.log(`Name: ${data.name}`);
    console.log(`Logo URL: "${data.logoUrl}"`);
    console.log(`Main Image URL: "${data.mainImageUrl}"`);
    console.log(`Main Image URL type: ${typeof data.mainImageUrl}`);
    console.log(`Main Image URL is null: ${data.mainImageUrl === null}`);
    console.log(`Main Image URL is undefined: ${data.mainImageUrl === undefined}`);
    
    console.log('\\nFull response structure:');
    console.log(Object.keys(data));
    
  } catch (error) {
    logger.error('Error testing admin API:');
  }
}

testAdminApi(); 