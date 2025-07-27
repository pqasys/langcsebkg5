import fetch from 'node-fetch';
import { logger } from '../lib/logger';

async function testApiResponse() {
  try {
    console.log('Testing API response for ABC School of English...\n');

    // First, let's get the list of institutions to find ABC School's ID
    const listResponse = await fetch('http://localhost:3000/api/institutions');
    const institutions = await listResponse.json();
    
    console.log('All institutions from API:');
    institutions.forEach((inst: any, index: number) => {
      console.log(`${index + 1}. ${inst.name} (ID: ${inst.id})`);
      console.log(`   Main Image: "${inst.mainImageUrl}"`);
    });

    // Find ABC School of English
    const abcSchool = institutions.find((inst: any) => inst.name.includes('ABC'));
    
    if (abcSchool) {
      console.log('\n=== ABC School of English Details ===');
      console.log(`ID: ${abcSchool.id}`);
      console.log(`Name: ${abcSchool.name}`);
      console.log(`Main Image URL: "${abcSchool.mainImageUrl}"`);
      
      // Now get the specific institution details
      const detailResponse = await fetch(`http://localhost:3000/api/institutions/${abcSchool.id}`);
      const details = await detailResponse.json();
      
      console.log('\n=== Detailed API Response ===');
      console.log(`Main Image: "${details.mainImage}"`);
      console.log(`Main Image URL: "${details.mainImageUrl}"`);
      console.log(`Logo: "${details.logo}"`);
      console.log(`Logo URL: "${details.logoUrl}"`);
    } else {
      console.log('ABC School of English not found in the list');
    }

  } catch (error) {
    logger.error('Error testing API:');
  }
}

// Run the script
testApiResponse(); 