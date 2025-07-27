import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function analyzeBundle() {
  console.log('📦 Analyzing Bundle Size...\n');

  try {
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      console.log('❌ No build found. Please run "npm run build" first.');
      return;
    }

    // Analyze static chunks
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('📊 Static Assets Analysis:');
      
      const chunksDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(chunksDir)) {
        const chunks = fs.readdirSync(chunksDir);
        let totalSize = 0;
        
        chunks.forEach(chunk => {
          const chunkPath = path.join(chunksDir, chunk);
          const stats = fs.statSync(chunkPath);
          const sizeKB = (stats.size / 1024).toFixed(2);
          totalSize += stats.size;
          console.log(`  ${chunk}: ${sizeKB} KB`);
        });
        
        console.log(`\nTotal chunks size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      }
    }

    // Check for large dependencies
    console.log('\n🔍 Large Dependencies Check:');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const largeDeps = [
      'react', 'react-dom', 'next', '@prisma/client', 
      'recharts', 'lucide-react', 'sonner'
    ];
    
    largeDeps.forEach(dep => {
      if (dependencies[dep]) {
        console.log(`  ${dep}: ${dependencies[dep]}`);
      }
    });

    // Performance recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('1. Enable gzip compression');
    console.log('2. Use dynamic imports for heavy components');
    console.log('3. Implement code splitting');
    console.log('4. Optimize images with next/image');
    console.log('5. Use React.memo for expensive components');
    console.log('6. Implement service worker for caching');

  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
  }
}

analyzeBundle(); 