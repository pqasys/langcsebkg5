# Dynamic Question Bank System

## Overview

The language proficiency test now uses a dynamic question bank system that allows for:
- **Random question selection** from a pool of 160+ questions
- **Balanced difficulty distribution** across CEFR levels (A1-C2)
- **Future scalability** to support 1000+ questions per language
- **Multiple question categories** (grammar, vocabulary, etc.)

## Architecture

### Question Bank Structure

```typescript
interface TestQuestion {
  id: string;
  level: string;           // CEFR level: A1, A2, B1, B2, C1, C2
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;       // grammar, vocabulary, reading, etc.
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

### File Structure

```
lib/data/
├── english-proficiency-questions.ts    # Main question bank (160 questions)
├── languages.ts                        # Language definitions
└── [future]/
    ├── spanish-proficiency-questions.ts
    ├── french-proficiency-questions.ts
    └── ...
```

## Current Implementation

### Question Distribution

**English Question Bank: 160 Questions**
- **A1 (Beginner):** 25 questions
- **A2 (Elementary):** 25 questions  
- **B1 (Intermediate):** 30 questions
- **B2 (Upper Intermediate):** 30 questions
- **C1 (Advanced):** 25 questions
- **C2 (Proficient):** 25 questions

### Question Categories

1. **Grammar (60%)**
   - Basic sentence structure
   - Verb tenses
   - Question formation
   - Passive voice
   - Reported speech
   - Conditionals
   - Subjunctive mood

2. **Vocabulary (30%)**
   - Idioms and expressions
   - Advanced vocabulary
   - Synonyms and antonyms
   - Contextual meaning

3. **Reading Comprehension (10%)**
   - Text analysis
   - Inference
   - Context clues

## Utility Functions

### Core Functions

```typescript
// Get random questions from the bank
getRandomQuestions(count: number = 80, level?: string, category?: string): TestQuestion[]

// Get questions by CEFR level
getQuestionsByLevel(level: string): TestQuestion[]

// Get questions by category
getQuestionsByCategory(category: string): TestQuestion[]

// Get questions by difficulty
getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestQuestion[]

// Get balanced question set (recommended for tests)
getBalancedQuestionSet(count: number = 80): TestQuestion[]
```

### Usage Examples

```typescript
// Get 80 balanced questions for a test
const testQuestions = getBalancedQuestionSet(80);

// Get only A2 level questions
const a2Questions = getQuestionsByLevel('A2');

// Get 20 random grammar questions
const grammarQuestions = getRandomQuestions(20, undefined, 'grammar');

// Get 10 random C1 vocabulary questions
const c1VocabQuestions = getRandomQuestions(10, 'C1', 'vocabulary');
```

## Test Generation Strategy

### Balanced Question Selection

The `getBalancedQuestionSet()` function ensures:

1. **Equal distribution** across CEFR levels
2. **Random selection** within each level
3. **Final shuffling** for unpredictability
4. **Category diversity** (grammar, vocabulary, etc.)

### Example Distribution (80 questions)

```
A1: 13 questions (16.25%)
A2: 13 questions (16.25%)
B1: 14 questions (17.5%)
B2: 14 questions (17.5%)
C1: 13 questions (16.25%)
C2: 13 questions (16.25%)
```

## Future Enhancements

### Planned Features

1. **Database Integration**
   ```sql
   CREATE TABLE question_banks (
     id VARCHAR(36) PRIMARY KEY,
     language_code VARCHAR(10),
     name VARCHAR(255),
     description TEXT,
     total_questions INT,
     created_at TIMESTAMP
   );

   CREATE TABLE questions (
     id VARCHAR(36) PRIMARY KEY,
     bank_id VARCHAR(36),
     level VARCHAR(10),
     category VARCHAR(50),
     difficulty VARCHAR(20),
     question TEXT,
     options JSON,
     correct_answer TEXT,
     explanation TEXT,
     usage_count INT DEFAULT 0,
     success_rate FLOAT DEFAULT 0
   );
   ```

2. **Adaptive Testing**
   - Questions adjust based on user performance
   - IRT (Item Response Theory) implementation
   - Dynamic difficulty adjustment

3. **Question Analytics**
   - Track question performance
   - Identify problematic questions
   - Optimize question bank based on data

4. **Multi-language Support**
   ```typescript
   // Future structure
   const SPANISH_QUESTIONS = [...];
   const FRENCH_QUESTIONS = [...];
   const GERMAN_QUESTIONS = [...];
   ```

### Scaling to 1000 Questions

**Target Distribution (1000 questions per language):**

```
A1: 150 questions (15%)
A2: 150 questions (15%)
B1: 200 questions (20%)
B2: 200 questions (20%)
C1: 150 questions (15%)
C2: 150 questions (15%)
```

**Categories:**
- Grammar: 400 questions (40%)
- Vocabulary: 300 questions (30%)
- Reading: 150 questions (15%)
- Listening: 100 questions (10%)
- Writing: 50 questions (5%)

## Implementation Benefits

### For Users
- **No memorization** - questions change each time
- **Fair assessment** - balanced difficulty levels
- **Comprehensive testing** - covers all CEFR levels
- **Detailed feedback** - explanations for each question

### For Administrators
- **Easy maintenance** - centralized question management
- **Scalable system** - easy to add new questions
- **Analytics ready** - track question performance
- **Multi-language support** - framework for other languages

### For Developers
- **Modular design** - easy to extend and modify
- **Type safety** - TypeScript interfaces
- **Performance optimized** - efficient question selection
- **Testable code** - utility functions are pure

## Migration Guide

### From Static to Dynamic

1. **Replace static questions array:**
   ```typescript
   // Old
   const questions = STATIC_QUESTIONS;
   
   // New
   const questions = getBalancedQuestionSet(80);
   ```

2. **Add question initialization:**
   ```typescript
   useEffect(() => {
     const selectedQuestions = getBalancedQuestionSet(80);
     setQuestions(selectedQuestions);
   }, []);
   ```

3. **Update imports:**
   ```typescript
   import { TestQuestion, getBalancedQuestionSet } from '@/lib/data/english-proficiency-questions';
   ```

## Best Practices

### Question Creation
1. **Clear and unambiguous** questions
2. **Plausible distractors** (wrong options)
3. **Detailed explanations** for learning
4. **Proper categorization** and difficulty levels
5. **CEFR level accuracy**

### Performance Optimization
1. **Lazy loading** for large question banks
2. **Caching** frequently used question sets
3. **Efficient shuffling** algorithms
4. **Memory management** for large datasets

### Quality Assurance
1. **Regular review** of question accuracy
2. **User feedback** integration
3. **Performance analytics** monitoring
4. **A/B testing** for question effectiveness

## Conclusion

The dynamic question bank system provides a robust foundation for scalable, fair, and comprehensive language proficiency testing. The modular design allows for easy expansion to support multiple languages and thousands of questions while maintaining performance and user experience quality. 