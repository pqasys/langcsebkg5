async function testInstitutionsAPI() {
  console.log('🧪 Testing institutions API for slug field...\n');

  try {
    const response = await fetch('http://localhost:3000/api/institutions');
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ Institutions API response:');
      console.log(`   Total institutions: ${data.institutions.length}`);
      
      data.institutions.forEach((inst: any, index: number) => {
        console.log(`   ${index + 1}. "${inst.name}"`);
        console.log(`      Slug: ${inst.slug || 'MISSING'}`);
        console.log(`      Status: ${inst.status}, Approved: ${inst.isApproved}`);
        console.log('');
      });
      
      // Check if all institutions have slugs
      const institutionsWithoutSlugs = data.institutions.filter((inst: any) => !inst.slug);
      
      if (institutionsWithoutSlugs.length === 0) {
        console.log('🎉 SUCCESS: All institutions have slugs!');
        console.log('✅ The undefined slug issue should now be resolved.');
      } else {
        console.log(`⚠️  WARNING: ${institutionsWithoutSlugs.length} institutions missing slugs:`);
        institutionsWithoutSlugs.forEach((inst: any) => {
          console.log(`   - ${inst.name} (ID: ${inst.id})`);
        });
      }
      
    } else {
      console.log(`❌ API request failed: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing institutions API:', error);
  }
}

testInstitutionsAPI();
