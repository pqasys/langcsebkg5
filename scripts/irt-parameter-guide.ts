#!/usr/bin/env tsx

/**
 * IRT Parameter Guide for Educational Quiz Questions
 * 
 * This script provides guidance on setting IRT (Item Response Theory) parameters
 * for different types of quiz questions in adaptive learning systems.
 */

interface IRTExample {
  questionType: string;
  difficulty: string;
  irtParams: {
    difficulty: number;
    discrimination: number;
    guessing: number;
  };
  explanation: string;
  useCase: string;
}

const irtExamples: IRTExample[] = [
  // Multiple Choice Examples
  {
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'EASY',
    irtParams: {
      difficulty: -1.5,
      discrimination: 0.8,
      guessing: 0.25
    },
    explanation: 'Easy multiple choice with 4 options. Low difficulty (-1.5), moderate discrimination (0.8), and 25% guessing probability.',
    useCase: 'Basic knowledge questions, warm-up questions'
  },
  {
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'MEDIUM',
    irtParams: {
      difficulty: 0.0,
      discrimination: 1.0,
      guessing: 0.25
    },
    explanation: 'Standard multiple choice with 4 options. Medium difficulty (0.0), good discrimination (1.0), and 25% guessing probability.',
    useCase: 'Core concept questions, application questions'
  },
  {
    questionType: 'MULTIPLE_CHOICE',
    difficulty: 'HARD',
    irtParams: {
      difficulty: 1.2,
      discrimination: 1.3,
      guessing: 0.25
    },
    explanation: 'Challenging multiple choice with 4 options. High difficulty (1.2), excellent discrimination (1.3), and 25% guessing probability.',
    useCase: 'Advanced concepts, synthesis questions'
  },

  // True/False Examples
  {
    questionType: 'TRUE_FALSE',
    difficulty: 'EASY',
    irtParams: {
      difficulty: -1.0,
      discrimination: 0.7,
      guessing: 0.5
    },
    explanation: 'Easy true/false question. Low difficulty (-1.0), moderate discrimination (0.7), and 50% guessing probability.',
    useCase: 'Basic fact checking, concept introduction'
  },
  {
    questionType: 'TRUE_FALSE',
    difficulty: 'HARD',
    irtParams: {
      difficulty: 1.5,
      discrimination: 1.1,
      guessing: 0.5
    },
    explanation: 'Challenging true/false question. High difficulty (1.5), good discrimination (1.1), and 50% guessing probability.',
    useCase: 'Complex reasoning, nuanced concepts'
  },

  // Fill-in-the-Blank Examples
  {
    questionType: 'FILL_IN_BLANK',
    difficulty: 'EASY',
    irtParams: {
      difficulty: -1.0,
      discrimination: 0.9,
      guessing: 0.05
    },
    explanation: 'Easy fill-in-the-blank. Low difficulty (-1.0), good discrimination (0.9), and very low guessing (5%).',
    useCase: 'Vocabulary, basic recall'
  },
  {
    questionType: 'FILL_IN_BLANK',
    difficulty: 'HARD',
    irtParams: {
      difficulty: 1.0,
      discrimination: 1.4,
      guessing: 0.05
    },
    explanation: 'Challenging fill-in-the-blank. High difficulty (1.0), excellent discrimination (1.4), and very low guessing (5%).',
    useCase: 'Complex calculations, detailed recall'
  },

  // Short Answer Examples
  {
    questionType: 'SHORT_ANSWER',
    difficulty: 'MEDIUM',
    irtParams: {
      difficulty: 0.2,
      discrimination: 1.2,
      guessing: 0.05
    },
    explanation: 'Medium short answer question. Moderate difficulty (0.2), good discrimination (1.2), and very low guessing (5%).',
    useCase: 'Concept explanation, problem solving'
  },

  // Essay Examples
  {
    questionType: 'ESSAY',
    difficulty: 'HARD',
    irtParams: {
      difficulty: 1.5,
      discrimination: 1.5,
      guessing: 0.02
    },
    explanation: 'Complex essay question. High difficulty (1.5), excellent discrimination (1.5), and minimal guessing (2%).',
    useCase: 'Critical analysis, synthesis, evaluation'
  },

  // Matching Examples
  {
    questionType: 'MATCHING',
    difficulty: 'MEDIUM',
    irtParams: {
      difficulty: 0.0,
      discrimination: 1.1,
      guessing: 0.15
    },
    explanation: 'Standard matching question. Medium difficulty (0.0), good discrimination (1.1), and moderate guessing (15%).',
    useCase: 'Concept relationships, vocabulary matching'
  },

  // Drag and Drop Examples
  {
    questionType: 'DRAG_DROP',
    difficulty: 'MEDIUM',
    irtParams: {
      difficulty: 0.0,
      discrimination: 1.0,
      guessing: 0.1
    },
    explanation: 'Drag and drop question. Medium difficulty (0.0), good discrimination (1.0), and low guessing (10%).',
    useCase: 'Sequencing, categorization, interactive learning'
  },

  // Hotspot Examples
  {
    questionType: 'HOTSPOT',
    difficulty: 'HARD',
    irtParams: {
      difficulty: 1.0,
      discrimination: 1.3,
      guessing: 0.05
    },
    explanation: 'Hotspot question. High difficulty (1.0), excellent discrimination (1.3), and very low guessing (5%).',
    useCase: 'Image analysis, precise identification, spatial reasoning'
  }
];

/**
 * IRT Parameter Guidelines
 */
const irtGuidelines = {
  difficulty: {
    range: [-4, 4],
    description: 'The ability level at which a student has a 50% chance of answering correctly (excluding guessing)',
    recommendations: {
      'Very Easy': [-4, -2],
      'Easy': [-2, -0.5],
      'Medium': [-0.5, 0.5],
      'Hard': [0.5, 2],
      'Very Hard': [2, 4]
    }
  },
  discrimination: {
    range: [0.1, 3],
    description: 'How well the question distinguishes between students of different ability levels',
    recommendations: {
      'Poor': [0.1, 0.5],
      'Fair': [0.5, 0.8],
      'Good': [0.8, 1.2],
      'Excellent': [1.2, 2.0],
      'Outstanding': [2.0, 3.0]
    }
  },
  guessing: {
    range: [0, 1],
    description: 'Probability of a student with very low ability answering correctly by guessing',
    recommendations: {
      'Multiple Choice (4 options)': 0.25,
      'Multiple Choice (5 options)': 0.20,
      'Multiple Choice (3 options)': 0.33,
      'True/False': 0.50,
      'Fill-in-the-Blank': 0.05,
      'Short Answer': 0.05,
      'Essay': 0.02,
      'Matching': 0.15,
      'Drag & Drop': 0.10,
      'Hotspot': 0.05,
      'Multiple Answer': 0.10,
      'Ordering': 0.05
    }
  }
};

/**
 * Calculate IRT parameters based on question characteristics
 */
function calculateIRTParameters(
  questionType: string,
  difficulty: string,
  numOptions?: number
): { difficulty: number; discrimination: number; guessing: number } {
  let irtDifficulty = 0;
  let irtDiscrimination = 1.0;
  let irtGuessing = 0.25;

  // Set difficulty based on level
  switch (difficulty) {
    case 'EASY':
      irtDifficulty = -1.0;
      irtDiscrimination = 0.8;
      break;
    case 'MEDIUM':
      irtDifficulty = 0.0;
      irtDiscrimination = 1.0;
      break;
    case 'HARD':
      irtDifficulty = 1.0;
      irtDiscrimination = 1.2;
      break;
  }

  // Set guessing based on question type
  switch (questionType) {
    case 'MULTIPLE_CHOICE':
      if (numOptions && numOptions > 0) {
        irtGuessing = 1 / numOptions;
      } else {
        irtGuessing = 0.25; // Default for 4 options
      }
      irtGuessing = Math.max(irtGuessing, 0.1); // Minimum guessing
      break;
    case 'TRUE_FALSE':
      irtGuessing = 0.5;
      break;
    case 'FILL_IN_BLANK':
      irtGuessing = 0.05;
      break;
    case 'SHORT_ANSWER':
      irtGuessing = 0.05;
      break;
    case 'ESSAY':
      irtGuessing = 0.02;
      break;
    case 'MATCHING':
      irtGuessing = 0.15;
      break;
    case 'DRAG_DROP':
      irtGuessing = 0.1;
      break;
    case 'HOTSPOT':
      irtGuessing = 0.05;
      break;
    case 'MULTIPLE_ANSWER':
      irtGuessing = 0.1;
      break;
    case 'ORDERING':
      irtGuessing = 0.05;
      break;
  }

  return { difficulty: irtDifficulty, discrimination: irtDiscrimination, guessing: irtGuessing };
}

/**
 * Validate IRT parameters
 */
function validateIRTParameters(params: { difficulty: number; discrimination: number; guessing: number }): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check difficulty range
  if (params.difficulty < -4 || params.difficulty > 4) {
    errors.push('Difficulty must be between -4 and 4');
  }

  // Check discrimination range
  if (params.discrimination < 0.1 || params.discrimination > 3) {
    errors.push('Discrimination must be between 0.1 and 3');
  }

  // Check guessing range
  if (params.guessing < 0 || params.guessing > 1) {
    errors.push('Guessing must be between 0 and 1');
  }

  // Warning checks
  if (params.discrimination < 0.5) {
    warnings.push('Low discrimination value - question may not effectively distinguish between ability levels');
  }

  if (params.guessing > 0.5) {
    warnings.push('High guessing probability - consider if this is appropriate for the question type');
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Main function to display the guide
 */
function displayIRTGuide() {
  console.log('🎯 IRT Parameter Guide for Adaptive Quizzes\n');
  console.log('=' .repeat(80));

  console.log('\n📊 IRT Parameter Overview:');
  console.log('IRT (Item Response Theory) parameters help adaptive quizzes select the most appropriate questions for each student.\n');

  // Display parameter descriptions
  Object.entries(irtGuidelines).forEach(([param, info]) => {
    console.log(`\n ${param.toUpperCase()} Parameter:`);
    console.log(`   Range: ${info.range[0]} to ${info.range[1]}`);
    console.log(`   Description: ${info.description}`);
    
    if ('recommendations' in info) {
      console.log('   Recommendations:');
      Object.entries(info.recommendations).forEach(([level, value]) => {
        if (Array.isArray(value)) {
          console.log(`     ${level}: ${value[0]} to ${value[1]}`);
        } else {
          console.log(`     ${level}: ${value}`);
        }
      });
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 Example IRT Parameters by Question Type:\n');

  // Display examples
  irtExamples.forEach((example, index) => {
    console.log(`${index + 1}. ${example.questionType} (${example.difficulty})`);
    console.log(`   Difficulty: ${example.irtParams.difficulty}`);
    console.log(`   Discrimination: ${example.irtParams.discrimination}`);
    console.log(`   Guessing: ${example.irtParams.guessing}`);
    console.log(`   Use Case: ${example.useCase}`);
    console.log(`   Explanation: ${example.explanation}\n`);
  });

  console.log('='.repeat(80));
  console.log('\n🛠️  Utility Functions:\n');

  // Demonstrate calculation function
  console.log('Example: Calculate IRT parameters for a medium-difficulty multiple choice question with 4 options:');
  const calculated = calculateIRTParameters('MULTIPLE_CHOICE', 'MEDIUM', 4);
  console.log(`   Result: ${JSON.stringify(calculated, null, 2)}\n`);

  // Demonstrate validation function
  console.log('Example: Validate IRT parameters:');
  const testParams = { difficulty: 0.5, discrimination: 1.2, guessing: 0.25 };
  const validation = validateIRTParameters(testParams);
  console.log(`   Parameters: ${JSON.stringify(testParams)}`);
  console.log(`   Valid: ${validation.isValid}`);
  if (validation.errors.length > 0) {
    console.log(`   Errors: ${validation.errors.join(', ')}`);
  }
  if (validation.warnings.length > 0) {
    console.log(`   Warnings: ${validation.warnings.join(', ')}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Best Practices:');
  console.log('1. Start with automatic calculation based on difficulty and question type');
  console.log('2. Use manual override only when you have empirical data or specific requirements');
  console.log('3. Validate parameters before saving to ensure they are within acceptable ranges');
  console.log('4. Monitor student performance to refine parameters over time');
  console.log('5. Consider the guessing parameter carefully - it significantly affects adaptive behavior');
  console.log('6. Higher discrimination values generally indicate better question quality');
  console.log('7. Difficulty should align with your target student population');
}

// Run the guide if this script is executed directly
if (require.main === module) {
  displayIRTGuide();
}

export {
  irtExamples,
  irtGuidelines,
  calculateIRTParameters,
  validateIRTParameters,
  displayIRTGuide
}; 