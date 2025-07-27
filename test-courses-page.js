// Test script to check courses page functionality
const fs = require('fs');
const path = require('path');

// // // // // // // // // // // // // // // // // // // // console.log('Testing courses page components...');

// Check if CourseCard component exists
const courseCardPath = path.join(__dirname, 'components', 'CourseCard.tsx');
if (fs.existsSync(courseCardPath)) {
  console.log('✓ CourseCard component exists');
} else {
  console.log('✗ CourseCard component not found');
}

// Check if courses page exists
const coursesPagePath = path.join(__dirname, 'app', 'courses', 'page.tsx');
if (fs.existsSync(coursesPagePath)) {
  console.log('✓ Courses page exists');
} else {
  console.log('✗ Courses page not found');
}

// Check if utils file exists
const utilsPath = path.join(__dirname, 'lib', 'utils.ts');
if (fs.existsSync(utilsPath)) {
  console.log('✓ Utils file exists');
} else {
  console.log('✗ Utils file not found');
}

// Check if react-optimizer exists
const optimizerPath = path.join(__dirname, 'lib', 'react-optimizer.tsx');
if (fs.existsSync(optimizerPath)) {
  console.log('✓ React optimizer exists');
} else {
  console.log('✗ React optimizer not found');
}

console.log('Component check completed!'); 