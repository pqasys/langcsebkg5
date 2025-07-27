const fs = require('fs');
const path = require('path');

function fixApiToastImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixApiToastImports(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Remove toast import
        if (content.includes("import { toast } from 'sonner'")) {
          content = content.replace(/import\s*{\s*toast\s*}\s*from\s*['"]sonner['"];?\s*\n?/g, '');
          modified = true;
        }
        
        // Replace toast.error with console.error
        if (content.includes('toast.error(')) {
          content = content.replace(/toast\.error\(/g, 'console.error(');
          modified = true;
        }
        
        // Replace toast.success with console.log
        if (content.includes('toast.success(')) {
          content = content.replace(/toast\.success\(/g, 'console.log(');
          modified = true;
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Fixed: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  });
}

// Start from the API directory
const apiDir = path.join(__dirname, '..', 'app', 'api');
console.log('Fixing toast imports in API routes...');
fixApiToastImports(apiDir);
console.log('Done!'); 