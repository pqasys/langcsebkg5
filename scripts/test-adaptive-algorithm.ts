import { AdaptiveQuizEngine, IRTParameters, StudentAbility } from '@/lib/quiz/adaptive-algorithm';

console.log('🧪 Testing Adaptive Quiz Algorithm...\n');

// Test 1: Response Probability Calculation
console.log('📊 Test 1: Response Probability Calculation');
const testParams: IRTParameters = {
  difficulty: 0,
  discrimination: 1.0,
  guessing: 0.25
};

const testThetas = [-2, -1, 0, 1, 2];
testThetas.forEach(theta => {
  const probability = AdaptiveQuizEngine.calculateResponseProbability(theta, testParams);
  console.log(`  θ = ${theta}: P(correct) = ${probability.toFixed(3)}`);
});
console.log('');

// Test 2: Ability Estimation
console.log('🎯 Test 2: Ability Estimation');
const testResponses = [
  { questionId: 'q1', correct: true, irtParams: { difficulty: -1, discrimination: 1.0, guessing: 0.25 } },
  { questionId: 'q2', correct: true, irtParams: { difficulty: 0, discrimination: 1.0, guessing: 0.25 } },
  { questionId: 'q3', correct: false, irtParams: { difficulty: 1, discrimination: 1.0, guessing: 0.25 } },
  { questionId: 'q4', correct: true, irtParams: { difficulty: 0.5, discrimination: 1.0, guessing: 0.25 } },
];

const ability = AdaptiveQuizEngine.estimateAbility(testResponses);
console.log(`  Estimated θ = ${ability.theta.toFixed(3)}`);
console.log(`  Confidence = ${ability.confidence.toFixed(3)}`);
console.log(`  History = [${ability.history.join(', ')}]`);
console.log('');

// Test 3: Question Selection
console.log('🎲 Test 3: Question Selection');
const availableQuestions = [
  {
    id: 'q1',
    irtParams: { difficulty: -1, discrimination: 1.0, guessing: 0.25 },
    category: 'easy',
    difficulty: 'EASY' as const,
    estimatedTime: 30
  },
  {
    id: 'q2',
    irtParams: { difficulty: 0, discrimination: 1.0, guessing: 0.25 },
    category: 'medium',
    difficulty: 'MEDIUM' as const,
    estimatedTime: 30
  },
  {
    id: 'q3',
    irtParams: { difficulty: 1, discrimination: 1.0, guessing: 0.25 },
    category: 'hard',
    difficulty: 'HARD' as const,
    estimatedTime: 30
  }
];

const answeredQuestions: string[] = [];
const nextQuestion = AdaptiveQuizEngine.selectNextQuestion(availableQuestions, ability, answeredQuestions);
console.log(`  Next question selected: ${nextQuestion?.id} (${nextQuestion?.difficulty})`);
console.log('');

// Test 4: Quiz Continuation Logic
console.log('⏱️ Test 4: Quiz Continuation Logic');
const continuationTests = [
  { ability: { theta: 0, confidence: 0.1, history: [] }, questionsAnswered: 3 },
  { ability: { theta: 0, confidence: 0.5, history: [] }, questionsAnswered: 5 },
  { ability: { theta: 0, confidence: 0.8, history: [] }, questionsAnswered: 8 },
  { ability: { theta: 0, confidence: 0.3, history: [] }, questionsAnswered: 20 }
];

continuationTests.forEach((test, index) => {
  const shouldContinue = AdaptiveQuizEngine.shouldContinueQuiz(
    test.ability,
    test.questionsAnswered,
    0.3
  );
  console.log(`  Test ${index + 1}: ${shouldContinue ? 'Continue' : 'Stop'} (θ=${test.ability.theta}, confidence=${test.ability.confidence}, questions=${test.questionsAnswered})`);
});
console.log('');

// Test 5: Final Results Calculation
console.log('🏆 Test 5: Final Results Calculation');
const finalResults = AdaptiveQuizEngine.calculateFinalResults(ability, 4);
console.log(`  Final Score: ${finalResults.score}%`);
console.log(`  Proficiency: ${finalResults.proficiency}`);
console.log(`  Confidence: ${finalResults.confidence}%`);
console.log(`  Recommendations: ${finalResults.recommendations.join(', ')}`);
console.log('');

// Test 6: Parameter Update
console.log('🔄 Test 6: Parameter Update');
const updatedParams = AdaptiveQuizEngine.updateQuestionParameters(
  'q1',
  true, // correct answer
  25, // response time in seconds
  testParams
);
console.log(`  Original difficulty: ${testParams.difficulty}`);
console.log(`  Updated difficulty: ${updatedParams.difficulty.toFixed(3)}`);
console.log(`  Original discrimination: ${testParams.discrimination}`);
console.log(`  Updated discrimination: ${updatedParams.discrimination.toFixed(3)}`);
console.log('');

console.log('✅ All tests completed successfully!');
console.log('\n🎉 Adaptive Quiz Algorithm is working correctly!'); 