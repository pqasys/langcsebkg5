export type Framework = 'CEFR' | 'ACTFL' | 'JLPT' | 'HSK' | 'TOPIK';

export interface FrameworkLevel {
  value: string;
  label: string;
}

export interface FrameworkMapping {
  [key: string]: {
    label: string;
    description: string;
    levels: FrameworkLevel[];
    equivalentLevels: {
      [key: string]: string[]; // Maps to equivalent levels in other frameworks
    };
  };
}

export const frameworkMappings: FrameworkMapping = {
  CEFR: {
    label: 'CEFR',
    description: '',
    levels: [
      { value: 'CEFR_A1', label: 'A1 - Beginner' },
      { value: 'CEFR_A2', label: 'A2 - Elementary' },
      { value: 'CEFR_B1', label: 'B1 - Intermediate' },
      { value: 'CEFR_B2', label: 'B2 - Upper Intermediate' },
      { value: 'CEFR_C1', label: 'C1 - Advanced' },
      { value: 'CEFR_C2', label: 'C2 - Mastery' }
    ],
    equivalentLevels: {
      'CEFR_A1': ['ACTFL_NOVICE_LOW', 'ACTFL_NOVICE_MID', 'JLPT_N5', 'HSK_1', 'TOPIK_1'],
      'CEFR_A2': ['ACTFL_NOVICE_HIGH', 'ACTFL_INTERMEDIATE_LOW', 'JLPT_N4', 'HSK_2', 'TOPIK_2'],
      'CEFR_B1': ['ACTFL_INTERMEDIATE_MID', 'ACTFL_INTERMEDIATE_HIGH', 'JLPT_N3', 'HSK_3', 'TOPIK_3'],
      'CEFR_B2': ['ACTFL_ADVANCED_LOW', 'ACTFL_ADVANCED_MID', 'JLPT_N2', 'HSK_4', 'TOPIK_4'],
      'CEFR_C1': ['ACTFL_ADVANCED_HIGH', 'ACTFL_SUPERIOR', 'JLPT_N1', 'HSK_5', 'TOPIK_5'],
      'CEFR_C2': ['ACTFL_SUPERIOR', 'JLPT_N1', 'HSK_6', 'TOPIK_6']
    }
  },
  ACTFL: {
    label: 'ACTFL (American Framework)',
    description: 'American Council on the Teaching of Foreign Languages',
    levels: [
      { value: 'ACTFL_NOVICE_LOW', label: 'Novice Low' },
      { value: 'ACTFL_NOVICE_MID', label: 'Novice Mid' },
      { value: 'ACTFL_NOVICE_HIGH', label: 'Novice High' },
      { value: 'ACTFL_INTERMEDIATE_LOW', label: 'Intermediate Low' },
      { value: 'ACTFL_INTERMEDIATE_MID', label: 'Intermediate Mid' },
      { value: 'ACTFL_INTERMEDIATE_HIGH', label: 'Intermediate High' },
      { value: 'ACTFL_ADVANCED_LOW', label: 'Advanced Low' },
      { value: 'ACTFL_ADVANCED_MID', label: 'Advanced Mid' },
      { value: 'ACTFL_ADVANCED_HIGH', label: 'Advanced High' },
      { value: 'ACTFL_SUPERIOR', label: 'Superior' }
    ],
    equivalentLevels: {
      'ACTFL_NOVICE_LOW': ['CEFR_A1', 'JLPT_N5', 'HSK_1', 'TOPIK_1'],
      'ACTFL_NOVICE_MID': ['CEFR_A1', 'JLPT_N5', 'HSK_1', 'TOPIK_1'],
      'ACTFL_NOVICE_HIGH': ['CEFR_A2', 'JLPT_N4', 'HSK_2', 'TOPIK_2'],
      'ACTFL_INTERMEDIATE_LOW': ['CEFR_A2', 'JLPT_N4', 'HSK_2', 'TOPIK_2'],
      'ACTFL_INTERMEDIATE_MID': ['CEFR_B1', 'JLPT_N3', 'HSK_3', 'TOPIK_3'],
      'ACTFL_INTERMEDIATE_HIGH': ['CEFR_B1', 'JLPT_N3', 'HSK_3', 'TOPIK_3'],
      'ACTFL_ADVANCED_LOW': ['CEFR_B2', 'JLPT_N2', 'HSK_4', 'TOPIK_4'],
      'ACTFL_ADVANCED_MID': ['CEFR_B2', 'JLPT_N2', 'HSK_4', 'TOPIK_4'],
      'ACTFL_ADVANCED_HIGH': ['CEFR_C1', 'JLPT_N1', 'HSK_5', 'TOPIK_5'],
      'ACTFL_SUPERIOR': ['CEFR_C1', 'CEFR_C2', 'JLPT_N1', 'HSK_6', 'TOPIK_6']
    }
  },
  JLPT: {
    label: 'JLPT (Japanese)',
    description: 'Japanese Language Proficiency Test',
    levels: [
      { value: 'JLPT_N5', label: 'N5 - Basic' },
      { value: 'JLPT_N4', label: 'N4 - Elementary' },
      { value: 'JLPT_N3', label: 'N3 - Intermediate' },
      { value: 'JLPT_N2', label: 'N2 - Pre-Advanced' },
      { value: 'JLPT_N1', label: 'N1 - Advanced' }
    ],
    equivalentLevels: {
      'JLPT_N5': ['CEFR_A1', 'ACTFL_NOVICE_LOW', 'ACTFL_NOVICE_MID', 'HSK_1', 'TOPIK_1'],
      'JLPT_N4': ['CEFR_A2', 'ACTFL_NOVICE_HIGH', 'ACTFL_INTERMEDIATE_LOW', 'HSK_2', 'TOPIK_2'],
      'JLPT_N3': ['CEFR_B1', 'ACTFL_INTERMEDIATE_MID', 'ACTFL_INTERMEDIATE_HIGH', 'HSK_3', 'TOPIK_3'],
      'JLPT_N2': ['CEFR_B2', 'ACTFL_ADVANCED_LOW', 'ACTFL_ADVANCED_MID', 'HSK_4', 'TOPIK_4'],
      'JLPT_N1': ['CEFR_C1', 'CEFR_C2', 'ACTFL_ADVANCED_HIGH', 'ACTFL_SUPERIOR', 'HSK_5', 'HSK_6', 'TOPIK_5', 'TOPIK_6']
    }
  },
  HSK: {
    label: 'HSK (Chinese)',
    description: 'Hanyu Shuiping Kaoshi',
    levels: [
      { value: 'HSK_1', label: 'HSK 1 - Basic' },
      { value: 'HSK_2', label: 'HSK 2 - Elementary' },
      { value: 'HSK_3', label: 'HSK 3 - Intermediate' },
      { value: 'HSK_4', label: 'HSK 4 - Upper Intermediate' },
      { value: 'HSK_5', label: 'HSK 5 - Advanced' },
      { value: 'HSK_6', label: 'HSK 6 - Mastery' }
    ],
    equivalentLevels: {
      'HSK_1': ['CEFR_A1', 'ACTFL_NOVICE_LOW', 'ACTFL_NOVICE_MID', 'JLPT_N5', 'TOPIK_1'],
      'HSK_2': ['CEFR_A2', 'ACTFL_NOVICE_HIGH', 'ACTFL_INTERMEDIATE_LOW', 'JLPT_N4', 'TOPIK_2'],
      'HSK_3': ['CEFR_B1', 'ACTFL_INTERMEDIATE_MID', 'ACTFL_INTERMEDIATE_HIGH', 'JLPT_N3', 'TOPIK_3'],
      'HSK_4': ['CEFR_B2', 'ACTFL_ADVANCED_LOW', 'ACTFL_ADVANCED_MID', 'JLPT_N2', 'TOPIK_4'],
      'HSK_5': ['CEFR_C1', 'ACTFL_ADVANCED_HIGH', 'ACTFL_SUPERIOR', 'JLPT_N1', 'TOPIK_5'],
      'HSK_6': ['CEFR_C2', 'ACTFL_SUPERIOR', 'JLPT_N1', 'TOPIK_6']
    }
  },
  TOPIK: {
    label: 'TOPIK (Korean)',
    description: 'Test of Proficiency in Korean',
    levels: [
      { value: 'TOPIK_1', label: 'TOPIK 1 - Beginner' },
      { value: 'TOPIK_2', label: 'TOPIK 2 - Elementary' },
      { value: 'TOPIK_3', label: 'TOPIK 3 - Intermediate' },
      { value: 'TOPIK_4', label: 'TOPIK 4 - Upper Intermediate' },
      { value: 'TOPIK_5', label: 'TOPIK 5 - Advanced' },
      { value: 'TOPIK_6', label: 'TOPIK 6 - Mastery' }
    ],
    equivalentLevels: {
      'TOPIK_1': ['CEFR_A1', 'ACTFL_NOVICE_LOW', 'ACTFL_NOVICE_MID', 'JLPT_N5', 'HSK_1'],
      'TOPIK_2': ['CEFR_A2', 'ACTFL_NOVICE_HIGH', 'ACTFL_INTERMEDIATE_LOW', 'JLPT_N4', 'HSK_2'],
      'TOPIK_3': ['CEFR_B1', 'ACTFL_INTERMEDIATE_MID', 'ACTFL_INTERMEDIATE_HIGH', 'JLPT_N3', 'HSK_3'],
      'TOPIK_4': ['CEFR_B2', 'ACTFL_ADVANCED_LOW', 'ACTFL_ADVANCED_MID', 'JLPT_N2', 'HSK_4'],
      'TOPIK_5': ['CEFR_C1', 'ACTFL_ADVANCED_HIGH', 'ACTFL_SUPERIOR', 'JLPT_N1', 'HSK_5'],
      'TOPIK_6': ['CEFR_C2', 'ACTFL_SUPERIOR', 'JLPT_N1', 'HSK_6']
    }
  }
};

export function getEquivalentLevels(level: string, targetFramework: Framework): string[] {
  const sourceFramework = level.split('_')[0] as Framework;
  return frameworkMappings[sourceFramework].equivalentLevels[level] || [];
}

export function getFrameworkLevels(framework: Framework): FrameworkLevel[] {
  return frameworkMappings[framework].levels;
}

export function getFrameworkInfo(framework: Framework) {
  return {
    label: frameworkMappings[framework].label,
    description: frameworkMappings[framework].description
  };
}

export function validateLevelForFramework(level: string, framework: Framework): boolean {
  return frameworkMappings[framework].levels.some(l => l.value === level);
}

export function getLevelLabel(level: string): string {
  const framework = level.split('_')[0] as Framework;
  const levelInfo = frameworkMappings[framework].levels.find(l => l.value === level);
  return levelInfo?.label || level;
}

export function getFrameworkFromLevel(level: string): Framework {
  return level.split('_')[0] as Framework;
} 