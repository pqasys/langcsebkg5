// Item Response Theory (IRT) Implementation for Adaptive Quizzes
// Based on 3-Parameter Logistic Model (3PL)

export interface IRTParameters {
  difficulty: number;    // b parameter - item difficulty
  discrimination: number; // a parameter - item discrimination
  guessing: number;      // c parameter - guessing parameter
}

export interface StudentAbility {
  theta: number;         // Current ability estimate
  confidence: number;    // Confidence in the estimate
  history: number[];     // Response history (1 for correct, 0 for incorrect)
}

export interface AdaptiveQuestion {
  id: string;
  irtParams: IRTParameters;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedTime: number;
}

export class AdaptiveQuizEngine {
  private static readonly MAX_QUESTIONS = 20;
  private static readonly MIN_QUESTIONS = 5;
  private static readonly CONVERGENCE_THRESHOLD = 0.1;
  private static readonly MAX_ITERATIONS = 10;

  /**
   * Calculate the probability of a correct response using 3PL model
   */
  static calculateResponseProbability(
    theta: number,
    irtParams: IRTParameters
  ): number {
    const { difficulty, discrimination, guessing } = irtParams;
    
    // 3PL formula: P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
    const exponent = -discrimination * (theta - difficulty);
    const denominator = 1 + Math.exp(exponent);
    const probability = guessing + (1 - guessing) / denominator;
    
    return Math.max(0, Math.min(1, probability)); // Clamp between 0 and 1
  }

  /**
   * Estimate student ability using Maximum Likelihood Estimation (MLE)
   */
  static estimateAbility(
    responses: { questionId: string; correct: boolean; irtParams: IRTParameters }[],
    initialTheta: number = 0
  ): StudentAbility {
    if (responses.length === 0) {
      return { theta: initialTheta, confidence: 0, history: [] };
    }

    let theta = initialTheta;
    let iteration = 0;

    while (iteration < this.MAX_ITERATIONS) {
      let numerator = 0;
      let denominator = 0;

      for (const response of responses) {
        const { irtParams, correct } = response;
        const p = this.calculateResponseProbability(theta, irtParams);
        
        // First derivative (gradient)
        const gradient = irtParams.discrimination * (correct - p) * p * (1 - p) / (p * (1 - p));
        
        // Second derivative (Hessian)
        const hessian = -Math.pow(irtParams.discrimination, 2) * p * (1 - p);

        numerator += gradient;
        denominator += hessian;
      }

      if (Math.abs(denominator) < 1e-6) break;

      const delta = numerator / denominator;
      theta -= delta;

      if (Math.abs(delta) < this.CONVERGENCE_THRESHOLD) break;
      iteration++;
    }

    // Calculate confidence based on Fisher Information
    const fisherInfo = responses.reduce((sum, response) => {
      const p = this.calculateResponseProbability(theta, response.irtParams);
      return sum + Math.pow(response.irtParams.discrimination, 2) * p * (1 - p);
    }, 0);

    const confidence = fisherInfo > 0 ? 1 / Math.sqrt(fisherInfo) : 0;

    return {
      theta,
      confidence: Math.min(1, confidence),
      history: responses.map(r => r.correct ? 1 : 0)
    };
  }

  /**
   * Select the next best question based on current ability estimate
   */
  static selectNextQuestion(
    availableQuestions: AdaptiveQuestion[],
    studentAbility: StudentAbility,
    answeredQuestions: string[]
  ): AdaptiveQuestion | null {
    if (availableQuestions.length === 0) return null;

    // Filter out already answered questions
    const unansweredQuestions = availableQuestions.filter(
      q => !answeredQuestions.includes(q.id)
    );

    if (unansweredQuestions.length === 0) return null;

    // Calculate information for each question at current ability level
    const questionInfo = unansweredQuestions.map(question => {
      const p = this.calculateResponseProbability(studentAbility.theta, question.irtParams);
      const information = Math.pow(question.irtParams.discrimination, 2) * p * (1 - p);
      
      return {
        question,
        information,
        difficulty: Math.abs(question.irtParams.difficulty - studentAbility.theta)
      };
    });

    // Sort by information (highest first) and difficulty proximity
    questionInfo.sort((a, b) => {
      // Prioritize high information questions
      if (Math.abs(a.information - b.information) > 0.1) {
        return b.information - a.information;
      }
      // If information is similar, prefer questions closer to current ability
      return a.difficulty - b.difficulty;
    });

    return questionInfo[0]?.question || null;
  }

  /**
   * Determine if the quiz should continue or terminate
   */
  static shouldContinueQuiz(
    studentAbility: StudentAbility,
    questionsAnswered: number,
    targetPrecision: number = 0.3
  ): boolean {
    // Stop if we've reached max questions
    if (questionsAnswered >= this.MAX_QUESTIONS) return false;
    
    // Stop if we have enough precision
    if (studentAbility.confidence >= targetPrecision) return false;
    
    // Stop if we have minimum questions and ability is well-estimated
    if (questionsAnswered >= this.MIN_QUESTIONS && studentAbility.confidence >= 0.5) {
      return false;
    }

    return true;
  }

  /**
   * Calculate final score and proficiency level
   */
  static calculateFinalResults(
    studentAbility: StudentAbility,
    totalQuestions: number
  ): {
    score: number;
    proficiency: string;
    confidence: number;
    recommendations: string[];
  } {
    // Convert theta to percentage score (assuming normal distribution)
    const score = Math.max(0, Math.min(100, 
      50 + (studentAbility.theta * 15) // Scale theta to 0-100 range
    ));

    // Determine proficiency level
    let proficiency: string;
    let recommendations: string[] = [];

    if (score >= 90) {
      proficiency = 'EXPERT';
      recommendations = ['Consider advanced courses', 'Mentor other students'];
    } else if (score >= 80) {
      proficiency = 'ADVANCED';
      recommendations = ['Practice advanced concepts', 'Take challenging exercises'];
    } else if (score >= 70) {
      proficiency = 'INTERMEDIATE';
      recommendations = ['Review foundational concepts', 'Practice regularly'];
    } else if (score >= 60) {
      proficiency = 'BEGINNER';
      recommendations = ['Focus on basics', 'Seek additional help'];
    } else {
      proficiency = 'NEEDS_IMPROVEMENT';
      recommendations = ['Review prerequisite materials', 'Consider remedial courses'];
    }

    return {
      score: Math.round(score),
      proficiency,
      confidence: Math.round(studentAbility.confidence * 100),
      recommendations
    };
  }

  /**
   * Update question IRT parameters based on response
   */
  static updateQuestionParameters(
    questionId: string,
    correct: boolean,
    responseTime: number,
    currentParams: IRTParameters
  ): IRTParameters {
    // Simple Bayesian update (in a real system, you'd use more sophisticated methods)
    const learningRate = 0.01;
    
    // Adjust difficulty based on response
    const difficultyAdjustment = correct ? -learningRate : learningRate;
    
    // Adjust discrimination based on response time (faster = more discriminating)
    const timeFactor = Math.max(0.5, Math.min(2, responseTime / 30)); // Normalize to 30 seconds
    const discriminationAdjustment = (1 - timeFactor) * learningRate;

    return {
      difficulty: currentParams.difficulty + difficultyAdjustment,
      discrimination: Math.max(0.1, currentParams.discrimination + discriminationAdjustment),
      guessing: currentParams.guessing // Keep guessing parameter stable
    };
  }
} 