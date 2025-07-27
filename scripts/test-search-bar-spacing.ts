import fs from 'fs';
import path from 'path';

interface SearchBarInfo {
  file: string;
  line: number;
  iconPosition: string;
  inputPadding: string;
  placeholder: string;
  spacing: number;
}

function findSearchBars(dir: string): SearchBarInfo[] {
  const searchBars: SearchBarInfo[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        searchBars.push(...findSearchBars(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Look for Search icon with absolute positioning
          const iconMatch = line.match(/<Search.*className="[^"]*absolute[^"]*left-([0-9]+)[^"]*"/);
          if (iconMatch) {
            const iconPosition = iconMatch[1];
            
            // Look for Input with placeholder in nearby lines
            for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 5); j++) {
              const inputLine = lines[j];
              const inputMatch = inputLine.match(/<Input[^>]*placeholder="([^"]*)"[^>]*className="([^"]*)"[^>]*>/);
              if (inputMatch) {
                const placeholder = inputMatch[1];
                const className = inputMatch[2];
                
                // Extract padding-left value
                const paddingMatch = className.match(/pl-([0-9]+)/);
                const inputPadding = paddingMatch ? paddingMatch[1] : '0';
                
                // Calculate spacing
                const spacing = parseInt(inputPadding) - parseInt(iconPosition);
                
                searchBars.push({
                  file: fullPath,
                  line: i + 1,
                  iconPosition: `left-${iconPosition}`,
                  inputPadding: `pl-${inputPadding}`,
                  placeholder,
                  spacing
                });
                break;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`Skipping directory ${dir}: ${error}`);
  }
  
  return searchBars;
}

async function main() {
  console.log('🔍 Testing search bar spacing across the project...\n');
  
  const searchDirs = ['app', 'components'];
  const allSearchBars: SearchBarInfo[] = [];
  
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Searching in ${dir}/`);
      const searchBars = findSearchBars(dir);
      allSearchBars.push(...searchBars);
    }
  }
  
  console.log(`\n📊 Found ${allSearchBars.length} search bars:\n`);
  
  const issues: SearchBarInfo[] = [];
  const good: SearchBarInfo[] = [];
  
  for (const searchBar of allSearchBars) {
    const isIssue = searchBar.spacing < 2;
    const status = isIssue ? '❌' : '✅';
    const issueText = isIssue ? ' (INSUFFICIENT SPACING)' : '';
    
    console.log(`${status} ${path.basename(searchBar.file)}:${searchBar.line}`);
    console.log(`   Icon: ${searchBar.iconPosition}, Input: ${searchBar.inputPadding}, Spacing: ${searchBar.spacing}${issueText}`);
    console.log(`   Placeholder: "${searchBar.placeholder}"`);
    console.log('');
    
    if (isIssue) {
      issues.push(searchBar);
    } else {
      good.push(searchBar);
    }
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`✅ Good spacing: ${good.length}`);
  console.log(`❌ Insufficient spacing: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log(`\n🔧 Search bars that need fixing:`);
    issues.forEach(issue => {
      console.log(`   - ${path.basename(issue.file)}:${issue.line} (spacing: ${issue.spacing})`);
    });
  } else {
    console.log(`\n✨ All search bars have adequate spacing!`);
  }
}

main().catch(console.error); 