import { SPANISH_PROFICIENCY_QUESTIONS } from '../lib/data/spanish-proficiency-questions';

console.log(`Total Spanish questions: ${SPANISH_PROFICIENCY_QUESTIONS.length}`);

// Count by level
const levelCounts = SPANISH_PROFICIENCY_QUESTIONS.reduce((acc, q) => {
  acc[q.level] = (acc[q.level] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\nQuestions by level:');
Object.entries(levelCounts).forEach(([level, count]) => {
  console.log(`  ${level}: ${count} questions`);
});

// Count by category
const categoryCounts = SPANISH_PROFICIENCY_QUESTIONS.reduce((acc, q) => {
  if (q.category) {
    acc[q.category] = (acc[q.category] || 0) + 1;
  }
  return acc;
}, {} as Record<string, number>);

console.log('\nQuestions by category:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} questions`);
});

// Count by level and category
const levelCategoryCounts = SPANISH_PROFICIENCY_QUESTIONS.reduce((acc, q) => {
  const key = `${q.level}-${q.category}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\nQuestions by level and category:');
Object.entries(levelCategoryCounts).forEach(([key, count]) => {
  console.log(`  ${key}: ${count} questions`);
});
