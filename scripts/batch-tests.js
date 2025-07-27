const fs = require('fs');
const path = require('path');

const TESTS_DIR = path.join(__dirname, '../tests');
const BATCH_SIZE = 10;
const BATCH_PREFIX = 'batch-auto-';

function findSpecFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.spec.ts'))
    .map(f => path.join(dir, f));
}

function extractTests(fileContent) {
  // Match Playwright test blocks: test('name', ... or test("name", ...
  const regex = /test\s*\(\s*([`'\"])(.*?)\1\s*,[\s\S]*?\)\s*;/g;
  let match;
  const tests = [];
  while ((match = regex.exec(fileContent)) !== null) {
    // Extract the full test block
    const start = match.index;
    let open = 0, i = start;
    for (; i < fileContent.length; i++) {
      if (fileContent.slice(i, i+5) === 'test(') open++;
      if (fileContent[i] === ')') open--;
      if (open === 0 && i > start) break;
    }
    tests.push(fileContent.slice(start, i+1));
    regex.lastIndex = i+1;
  }
  return tests;
}

function batchTests() {
  const specFiles = findSpecFiles(TESTS_DIR);
  let allTests = [];
  let imports = new Set();

  for (const file of specFiles) {
    const content = fs.readFileSync(file, 'utf8');
    // Collect import lines
    content.split('\n').forEach(line => {
      if (line.startsWith('import')) imports.add(line);
    });
    // Extract test blocks
    allTests = allTests.concat(extractTests(content));
  }

  // Split into batches
  let batchNum = 1;
  for (let i = 0; i < allTests.length; i += BATCH_SIZE) {
    const batchTests = allTests.slice(i, i + BATCH_SIZE);
    const batchFile = path.join(TESTS_DIR, `${BATCH_PREFIX}${batchNum}.spec.ts`);
    const batchContent =
      Array.from(imports).join('\n') +
      `\n\ntest.describe('Batch ${batchNum}', () => {\n` +
      batchTests.join('\n\n') +
      '\n});\n';
    fs.writeFileSync(batchFile, batchContent, 'utf8');
    console.log(`Created ${batchFile} with ${batchTests.length} tests.`);
    batchNum++;
  }
}

batchTests(); 