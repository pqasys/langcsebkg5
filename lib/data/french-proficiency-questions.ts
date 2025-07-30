export interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// French Proficiency Test Question Bank (A1-C2)
export const FRENCH_PROFICIENCY_QUESTIONS: TestQuestion[] = [
  // Level A1 - Grammar
  {
    id: 'A1-G-1',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "être" à la première personne du singulier ?',
    options: ['es', 'est', 'suis', 'sont'],
    correctAnswer: 'suis',
    explanation: 'La première personne du singulier du verbe "être" est "je suis".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-2',
    level: 'A1',
    question: 'Comment dit-on "I am" en français ?',
    options: ['Je es', 'Je suis', 'Je est', 'Je sont'],
    correctAnswer: 'Je suis',
    explanation: 'La traduction correcte de "I am" est "Je suis".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-3',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "avoir" à la troisième personne du singulier ?',
    options: ['as', 'a', 'ont', 'avez'],
    correctAnswer: 'a',
    explanation: 'La troisième personne du singulier du verbe "avoir" est "il/elle a".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-4',
    level: 'A1',
    question: 'Comment dit-on "I have" en français ?',
    options: ['Je as', 'J\'ai', 'Je a', 'Je ont'],
    correctAnswer: 'J\'ai',
    explanation: 'La traduction correcte de "I have" est "J\'ai".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-5',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "aller" à la première personne du singulier ?',
    options: ['vas', 'va', 'vais', 'vont'],
    correctAnswer: 'vais',
    explanation: 'La première personne du singulier du verbe "aller" est "je vais".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-6',
    level: 'A1',
    question: 'Comment dit-on "I go" en français ?',
    options: ['Je vas', 'Je vais', 'Je va', 'Je vont'],
    correctAnswer: 'Je vais',
    explanation: 'La traduction correcte de "I go" est "Je vais".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-7',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "faire" à la première personne du singulier ?',
    options: ['fais', 'fait', 'font', 'faisez'],
    correctAnswer: 'fais',
    explanation: 'La première personne du singulier du verbe "faire" est "je fais".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-8',
    level: 'A1',
    question: 'Comment dit-on "I do" en français ?',
    options: ['Je fait', 'Je fais', 'Je font', 'Je faisez'],
    correctAnswer: 'Je fais',
    explanation: 'La traduction correcte de "I do" est "Je fais".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-9',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "venir" à la première personne du singulier ?',
    options: ['viens', 'vient', 'viennent', 'venez'],
    correctAnswer: 'viens',
    explanation: 'La première personne du singulier du verbe "venir" est "je viens".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-10',
    level: 'A1',
    question: 'Comment dit-on "I come" en français ?',
    options: ['Je vient', 'Je viens', 'Je viennent', 'Je venez'],
    correctAnswer: 'Je viens',
    explanation: 'La traduction correcte de "I come" est "Je viens".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-11',
    level: 'A1',
    question: 'Quelle est la forme correcte du verbe "voir" à la première personne du singulier ?',
    options: ['vois', 'voit', 'voient', 'voyez'],
    correctAnswer: 'vois',
    explanation: 'La première personne du singulier du verbe "voir" est "je vois".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-12',
    level: 'A1',
    question: 'Comment dit-on "I see" en français ?',
    options: ['Je voit', 'Je vois', 'Je voient', 'Je voyez'],
    correctAnswer: 'Je vois',
    explanation: 'La traduction correcte de "I see" est "Je vois".',
    category: 'grammar',
    difficulty: 'easy'
  },

  // Level A1 - Vocabulary
  {
    id: 'A1-V-1',
    level: 'A1',
    question: 'Comment dit-on "hello" en français ?',
    options: ['Au revoir', 'Bonjour', 'Merci', 'S\'il vous plaît'],
    correctAnswer: 'Bonjour',
    explanation: 'La traduction correcte de "hello" est "Bonjour".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-2',
    level: 'A1',
    question: 'Comment dit-on "goodbye" en français ?',
    options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
    correctAnswer: 'Au revoir',
    explanation: 'La traduction correcte de "goodbye" est "Au revoir".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-3',
    level: 'A1',
    question: 'Comment dit-on "thank you" en français ?',
    options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
    correctAnswer: 'Merci',
    explanation: 'La traduction correcte de "thank you" est "Merci".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-4',
    level: 'A1',
    question: 'Comment dit-on "please" en français ?',
    options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
    correctAnswer: 'S\'il vous plaît',
    explanation: 'La traduction correcte de "please" est "S\'il vous plaît".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-5',
    level: 'A1',
    question: 'Comment dit-on "yes" en français ?',
    options: ['Non', 'Oui', 'Peut-être', 'Jamais'],
    correctAnswer: 'Oui',
    explanation: 'La traduction correcte de "yes" est "Oui".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-6',
    level: 'A1',
    question: 'Comment dit-on "no" en français ?',
    options: ['Oui', 'Non', 'Peut-être', 'Jamais'],
    correctAnswer: 'Non',
    explanation: 'La traduction correcte de "no" est "Non".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-7',
    level: 'A1',
    question: 'Comment dit-on "water" en français ?',
    options: ['Pain', 'Eau', 'Vin', 'Café'],
    correctAnswer: 'Eau',
    explanation: 'La traduction correcte de "water" est "Eau".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-8',
    level: 'A1',
    question: 'Comment dit-on "bread" en français ?',
    options: ['Eau', 'Pain', 'Vin', 'Café'],
    correctAnswer: 'Pain',
    explanation: 'La traduction correcte de "bread" est "Pain".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-9',
    level: 'A1',
    question: 'Comment dit-on "house" en français ?',
    options: ['Voiture', 'Maison', 'Appartement', 'Bureau'],
    correctAnswer: 'Maison',
    explanation: 'La traduction correcte de "house" est "Maison".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-10',
    level: 'A1',
    question: 'Comment dit-on "car" en français ?',
    options: ['Maison', 'Voiture', 'Appartement', 'Bureau'],
    correctAnswer: 'Voiture',
    explanation: 'La traduction correcte de "car" est "Voiture".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-11',
    level: 'A1',
    question: 'Comment dit-on "book" en français ?',
    options: ['Magazine', 'Livre', 'Journal', 'Revue'],
    correctAnswer: 'Livre',
    explanation: 'La traduction correcte de "book" est "Livre".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-12',
    level: 'A1',
    question: 'Comment dit-on "time" en français ?',
    options: ['Heure', 'Temps', 'Moment', 'Période'],
    correctAnswer: 'Temps',
    explanation: 'La traduction correcte de "time" est "Temps".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-13',
    level: 'A1',
    question: 'Comment dit-on "day" en français ?',
    options: ['Nuit', 'Jour', 'Matin', 'Soir'],
    correctAnswer: 'Jour',
    explanation: 'La traduction correcte de "day" est "Jour".',
    category: 'vocabulary',
    difficulty: 'easy'
  },

  // Level A2 - Grammar
  {
    id: 'A2-G-1',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "être" au passé composé à la première personne ?',
    options: ['J\'ai été', 'Je suis été', 'J\'étais', 'Je serai'],
    correctAnswer: 'J\'ai été',
    explanation: 'Le passé composé du verbe "être" est "j\'ai été".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-2',
    level: 'A2',
    question: 'Comment dit-on "I was" en français ?',
    options: ['Je suis', 'J\'étais', 'J\'ai été', 'Je serai'],
    correctAnswer: 'J\'étais',
    explanation: 'La traduction correcte de "I was" est "J\'étais" (imparfait).',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-3',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "avoir" au passé composé à la première personne ?',
    options: ['J\'ai eu', 'Je suis eu', 'J\'avais', 'J\'aurai'],
    correctAnswer: 'J\'ai eu',
    explanation: 'Le passé composé du verbe "avoir" est "j\'ai eu".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-4',
    level: 'A2',
    question: 'Comment dit-on "I had" en français ?',
    options: ['J\'ai', 'J\'avais', 'J\'ai eu', 'J\'aurai'],
    correctAnswer: 'J\'avais',
    explanation: 'La traduction correcte de "I had" est "J\'avais" (imparfait).',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-5',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "aller" au passé composé à la première personne ?',
    options: ['J\'ai allé', 'Je suis allé', 'J\'allais', 'J\'irai'],
    correctAnswer: 'Je suis allé',
    explanation: 'Le passé composé du verbe "aller" est "je suis allé".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-6',
    level: 'A2',
    question: 'Comment dit-on "I went" en français ?',
    options: ['Je vais', 'Je suis allé', 'J\'allais', 'J\'irai'],
    correctAnswer: 'Je suis allé',
    explanation: 'La traduction correcte de "I went" est "Je suis allé".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-7',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "faire" au passé composé à la première personne ?',
    options: ['J\'ai fait', 'Je suis fait', 'Je faisais', 'Je ferai'],
    correctAnswer: 'J\'ai fait',
    explanation: 'Le passé composé du verbe "faire" est "j\'ai fait".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-8',
    level: 'A2',
    question: 'Comment dit-on "I did" en français ?',
    options: ['Je fais', 'J\'ai fait', 'Je faisais', 'Je ferai'],
    correctAnswer: 'J\'ai fait',
    explanation: 'La traduction correcte de "I did" est "J\'ai fait".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-9',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "venir" au passé composé à la première personne ?',
    options: ['J\'ai venu', 'Je suis venu', 'Je venais', 'Je viendrai'],
    correctAnswer: 'Je suis venu',
    explanation: 'Le passé composé du verbe "venir" est "je suis venu".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-10',
    level: 'A2',
    question: 'Comment dit-on "I came" en français ?',
    options: ['Je viens', 'Je suis venu', 'Je venais', 'Je viendrai'],
    correctAnswer: 'Je suis venu',
    explanation: 'La traduction correcte de "I came" est "Je suis venu".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-11',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "voir" au passé composé à la première personne ?',
    options: ['J\'ai vu', 'Je suis vu', 'Je voyais', 'Je verrai'],
    correctAnswer: 'J\'ai vu',
    explanation: 'Le passé composé du verbe "voir" est "j\'ai vu".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-12',
    level: 'A2',
    question: 'Comment dit-on "I saw" en français ?',
    options: ['Je vois', 'J\'ai vu', 'Je voyais', 'Je verrai'],
    correctAnswer: 'J\'ai vu',
    explanation: 'La traduction correcte de "I saw" est "J\'ai vu".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-13',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "être" au futur simple à la première personne ?',
    options: ['Je suis', 'Je serai', 'J\'étais', 'J\'ai été'],
    correctAnswer: 'Je serai',
    explanation: 'Le futur simple du verbe "être" est "je serai".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-14',
    level: 'A2',
    question: 'Comment dit-on "I will be" en français ?',
    options: ['Je suis', 'Je serai', 'J\'étais', 'J\'ai été'],
    correctAnswer: 'Je serai',
    explanation: 'La traduction correcte de "I will be" est "Je serai".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-15',
    level: 'A2',
    question: 'Quelle est la forme correcte du verbe "avoir" au futur simple à la première personne ?',
    options: ['J\'ai', 'J\'aurai', 'J\'avais', 'J\'ai eu'],
    correctAnswer: 'J\'aurai',
    explanation: 'Le futur simple du verbe "avoir" est "j\'aurai".',
    category: 'grammar',
    difficulty: 'easy'
  },

  // Level A2 - Vocabulary
  {
    id: 'A2-V-1',
    level: 'A2',
    question: 'Comment dit-on "morning" en français ?',
    options: ['Soir', 'Matin', 'Après-midi', 'Nuit'],
    correctAnswer: 'Matin',
    explanation: 'La traduction correcte de "morning" est "Matin".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-2',
    level: 'A2',
    question: 'Comment dit-on "evening" en français ?',
    options: ['Matin', 'Soir', 'Après-midi', 'Nuit'],
    correctAnswer: 'Soir',
    explanation: 'La traduction correcte de "evening" est "Soir".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-3',
    level: 'A2',
    question: 'Comment dit-on "night" en français ?',
    options: ['Matin', 'Soir', 'Après-midi', 'Nuit'],
    correctAnswer: 'Nuit',
    explanation: 'La traduction correcte de "night" est "Nuit".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-4',
    level: 'A2',
    question: 'Comment dit-on "afternoon" en français ?',
    options: ['Matin', 'Soir', 'Après-midi', 'Nuit'],
    correctAnswer: 'Après-midi',
    explanation: 'La traduction correcte de "afternoon" est "Après-midi".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-5',
    level: 'A2',
    question: 'Comment dit-on "week" en français ?',
    options: ['Mois', 'Semaine', 'Année', 'Jour'],
    correctAnswer: 'Semaine',
    explanation: 'La traduction correcte de "week" est "Semaine".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-6',
    level: 'A2',
    question: 'Comment dit-on "month" en français ?',
    options: ['Semaine', 'Mois', 'Année', 'Jour'],
    correctAnswer: 'Mois',
    explanation: 'La traduction correcte de "month" est "Mois".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-7',
    level: 'A2',
    question: 'Comment dit-on "year" en français ?',
    options: ['Semaine', 'Mois', 'Année', 'Jour'],
    correctAnswer: 'Année',
    explanation: 'La traduction correcte de "year" est "Année".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-8',
    level: 'A2',
    question: 'Comment dit-on "family" en français ?',
    options: ['Ami', 'Famille', 'Groupe', 'Équipe'],
    correctAnswer: 'Famille',
    explanation: 'La traduction correcte de "family" est "Famille".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-9',
    level: 'A2',
    question: 'Comment dit-on "friend" en français ?',
    options: ['Famille', 'Ami', 'Groupe', 'Équipe'],
    correctAnswer: 'Ami',
    explanation: 'La traduction correcte de "friend" est "Ami".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-10',
    level: 'A2',
    question: 'Comment dit-on "work" en français ?',
    options: ['Travail', 'Bureau', 'École', 'Maison'],
    correctAnswer: 'Travail',
    explanation: 'La traduction correcte de "work" est "Travail".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-11',
    level: 'A2',
    question: 'Comment dit-on "school" en français ?',
    options: ['Travail', 'Bureau', 'École', 'Maison'],
    correctAnswer: 'École',
    explanation: 'La traduction correcte de "school" est "École".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-12',
    level: 'A2',
    question: 'Comment dit-on "office" en français ?',
    options: ['Travail', 'Bureau', 'École', 'Maison'],
    correctAnswer: 'Bureau',
    explanation: 'La traduction correcte de "office" est "Bureau".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-13',
    level: 'A2',
    question: 'Comment dit-on "city" en français ?',
    options: ['Ville', 'Pays', 'Région', 'Quartier'],
    correctAnswer: 'Ville',
    explanation: 'La traduction correcte de "city" est "Ville".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-14',
    level: 'A2',
    question: 'Comment dit-on "country" en français ?',
    options: ['Ville', 'Pays', 'Région', 'Quartier'],
    correctAnswer: 'Pays',
    explanation: 'La traduction correcte de "country" est "Pays".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-15',
    level: 'A2',
    question: 'Comment dit-on "language" en français ?',
    options: ['Mot', 'Langue', 'Parole', 'Discours'],
    correctAnswer: 'Langue',
    explanation: 'La traduction correcte de "language" est "Langue".',
    category: 'vocabulary',
    difficulty: 'easy'
  },

  // Level B1 - Grammar
  {
    id: 'B1-G-1',
    level: 'B1',
    question: 'Quelle est la forme correcte du conditionnel présent du verbe "être" à la première personne ?',
    options: ['Je serais', 'Je serai', 'J\'étais', 'Je suis'],
    correctAnswer: 'Je serais',
    explanation: 'Le conditionnel présent du verbe "être" à la première personne est "je serais".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-2',
    level: 'B1',
    question: 'Comment dit-on "I would be" en français ?',
    options: ['Je serai', 'Je serais', 'J\'étais', 'Je suis'],
    correctAnswer: 'Je serais',
    explanation: 'La traduction correcte de "I would be" est "Je serais".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-3',
    level: 'B1',
    question: 'Quelle est la forme correcte du conditionnel présent du verbe "avoir" à la première personne ?',
    options: ['J\'aurai', 'J\'aurais', 'J\'avais', 'J\'ai'],
    correctAnswer: 'J\'aurais',
    explanation: 'Le conditionnel présent du verbe "avoir" à la première personne est "j\'aurais".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-4',
    level: 'B1',
    question: 'Comment dit-on "I would have" en français ?',
    options: ['J\'aurai', 'J\'aurais', 'J\'avais', 'J\'ai'],
    correctAnswer: 'J\'aurais',
    explanation: 'La traduction correcte de "I would have" est "J\'aurais".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-5',
    level: 'B1',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "être" à la première personne ?',
    options: ['Je sois', 'Je suis', 'J\'étais', 'Je serai'],
    correctAnswer: 'Je sois',
    explanation: 'Le subjonctif présent du verbe "être" à la première personne est "je sois".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-6',
    level: 'B1',
    question: 'Comment dit-on "that I be" en français ?',
    options: ['Que je suis', 'Que je sois', 'Que j\'étais', 'Que je serai'],
    correctAnswer: 'Que je sois',
    explanation: 'La traduction correcte de "that I be" est "Que je sois".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-7',
    level: 'B1',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "avoir" à la première personne ?',
    options: ['J\'aie', 'J\'ai', 'J\'avais', 'J\'aurai'],
    correctAnswer: 'J\'aie',
    explanation: 'Le subjonctif présent du verbe "avoir" à la première personne est "j\'aie".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-8',
    level: 'B1',
    question: 'Comment dit-on "that I have" en français ?',
    options: ['Que j\'ai', 'Que j\'aie', 'Que j\'avais', 'Que j\'aurai'],
    correctAnswer: 'Que j\'aie',
    explanation: 'La traduction correcte de "that I have" est "Que j\'aie".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-9',
    level: 'B1',
    question: 'Quelle est la forme correcte du plus-que-parfait du verbe "être" à la première personne ?',
    options: ['J\'avais été', 'J\'ai été', 'J\'étais', 'Je serai'],
    correctAnswer: 'J\'avais été',
    explanation: 'Le plus-que-parfait du verbe "être" à la première personne est "j\'avais été".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-10',
    level: 'B1',
    question: 'Comment dit-on "I had been" en français ?',
    options: ['J\'ai été', 'J\'avais été', 'J\'étais', 'Je serai'],
    correctAnswer: 'J\'avais été',
    explanation: 'La traduction correcte de "I had been" est "J\'avais été".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-11',
    level: 'B1',
    question: 'Quelle est la forme correcte du plus-que-parfait du verbe "avoir" à la première personne ?',
    options: ['J\'avais eu', 'J\'ai eu', 'J\'avais', 'J\'aurai'],
    correctAnswer: 'J\'avais eu',
    explanation: 'Le plus-que-parfait du verbe "avoir" à la première personne est "j\'avais eu".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-12',
    level: 'B1',
    question: 'Comment dit-on "I had had" en français ?',
    options: ['J\'ai eu', 'J\'avais eu', 'J\'avais', 'J\'aurai'],
    correctAnswer: 'J\'avais eu',
    explanation: 'La traduction correcte de "I had had" est "J\'avais eu".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-13',
    level: 'B1',
    question: 'Quelle est la forme correcte du futur antérieur du verbe "être" à la première personne ?',
    options: ['J\'aurai été', 'J\'avais été', 'J\'ai été', 'Je serai'],
    correctAnswer: 'J\'aurai été',
    explanation: 'Le futur antérieur du verbe "être" à la première personne est "j\'aurai été".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-14',
    level: 'B1',
    question: 'Comment dit-on "I will have been" en français ?',
    options: ['J\'ai été', 'J\'avais été', 'J\'aurai été', 'Je serai'],
    correctAnswer: 'J\'aurai été',
    explanation: 'La traduction correcte de "I will have been" est "J\'aurai été".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-15',
    level: 'B1',
    question: 'Quelle est la forme correcte du futur antérieur du verbe "avoir" à la première personne ?',
    options: ['J\'aurai eu', 'J\'avais eu', 'J\'ai eu', 'J\'aurai'],
    correctAnswer: 'J\'aurai eu',
    explanation: 'Le futur antérieur du verbe "avoir" à la première personne est "j\'aurai eu".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-16',
    level: 'B1',
    question: 'Comment dit-on "I will have had" en français ?',
    options: ['J\'ai eu', 'J\'avais eu', 'J\'aurai eu', 'J\'aurai'],
    correctAnswer: 'J\'aurai eu',
    explanation: 'La traduction correcte de "I will have had" est "J\'aurai eu".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-17',
    level: 'B1',
    question: 'Quelle est la forme correcte du conditionnel passé du verbe "être" à la première personne ?',
    options: ['J\'aurais été', 'J\'avais été', 'J\'ai été', 'Je serais'],
    correctAnswer: 'J\'aurais été',
    explanation: 'Le conditionnel passé du verbe "être" à la première personne est "j\'aurais été".',
    category: 'grammar',
    difficulty: 'medium'
  },

  // Level B1 - Vocabulary
  {
    id: 'B1-V-1',
    level: 'B1',
    question: 'Comment dit-on "business" en français ?',
    options: ['Affaires', 'Commerce', 'Entreprise', 'Travail'],
    correctAnswer: 'Affaires',
    explanation: 'La traduction correcte de "business" est "Affaires".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-2',
    level: 'B1',
    question: 'Comment dit-on "company" en français ?',
    options: ['Affaires', 'Commerce', 'Entreprise', 'Travail'],
    correctAnswer: 'Entreprise',
    explanation: 'La traduction correcte de "company" est "Entreprise".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-3',
    level: 'B1',
    question: 'Comment dit-on "meeting" en français ?',
    options: ['Rendez-vous', 'Réunion', 'Conférence', 'Entretien'],
    correctAnswer: 'Réunion',
    explanation: 'La traduction correcte de "meeting" est "Réunion".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-4',
    level: 'B1',
    question: 'Comment dit-on "appointment" en français ?',
    options: ['Rendez-vous', 'Réunion', 'Conférence', 'Entretien'],
    correctAnswer: 'Rendez-vous',
    explanation: 'La traduction correcte de "appointment" est "Rendez-vous".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-5',
    level: 'B1',
    question: 'Comment dit-on "conference" en français ?',
    options: ['Rendez-vous', 'Réunion', 'Conférence', 'Entretien'],
    correctAnswer: 'Conférence',
    explanation: 'La traduction correcte de "conference" est "Conférence".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-6',
    level: 'B1',
    question: 'Comment dit-on "interview" en français ?',
    options: ['Rendez-vous', 'Réunion', 'Conférence', 'Entretien'],
    correctAnswer: 'Entretien',
    explanation: 'La traduction correcte de "interview" est "Entretien".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-7',
    level: 'B1',
    question: 'Comment dit-on "project" en français ?',
    options: ['Projet', 'Plan', 'Programme', 'Tâche'],
    correctAnswer: 'Projet',
    explanation: 'La traduction correcte de "project" est "Projet".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-8',
    level: 'B1',
    question: 'Comment dit-on "plan" en français ?',
    options: ['Projet', 'Plan', 'Programme', 'Tâche'],
    correctAnswer: 'Plan',
    explanation: 'La traduction correcte de "plan" est "Plan".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-9',
    level: 'B1',
    question: 'Comment dit-on "program" en français ?',
    options: ['Projet', 'Plan', 'Programme', 'Tâche'],
    correctAnswer: 'Programme',
    explanation: 'La traduction correcte de "program" est "Programme".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-10',
    level: 'B1',
    question: 'Comment dit-on "task" en français ?',
    options: ['Projet', 'Plan', 'Programme', 'Tâche'],
    correctAnswer: 'Tâche',
    explanation: 'La traduction correcte de "task" est "Tâche".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-11',
    level: 'B1',
    question: 'Comment dit-on "goal" en français ?',
    options: ['But', 'Objectif', 'Cible', 'Fin'],
    correctAnswer: 'Objectif',
    explanation: 'La traduction correcte de "goal" est "Objectif".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-12',
    level: 'B1',
    question: 'Comment dit-on "target" en français ?',
    options: ['But', 'Objectif', 'Cible', 'Fin'],
    correctAnswer: 'Cible',
    explanation: 'La traduction correcte de "target" est "Cible".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-13',
    level: 'B1',
    question: 'Comment dit-on "purpose" en français ?',
    options: ['But', 'Objectif', 'Cible', 'Fin'],
    correctAnswer: 'But',
    explanation: 'La traduction correcte de "purpose" est "But".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-14',
    level: 'B1',
    question: 'Comment dit-on "end" en français ?',
    options: ['But', 'Objectif', 'Cible', 'Fin'],
    correctAnswer: 'Fin',
    explanation: 'La traduction correcte de "end" est "Fin".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-15',
    level: 'B1',
    question: 'Comment dit-on "beginning" en français ?',
    options: ['Début', 'Commencement', 'Start', 'Origine'],
    correctAnswer: 'Début',
    explanation: 'La traduction correcte de "beginning" est "Début".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-16',
    level: 'B1',
    question: 'Comment dit-on "start" en français ?',
    options: ['Début', 'Commencement', 'Start', 'Origine'],
    correctAnswer: 'Commencement',
    explanation: 'La traduction correcte de "start" est "Commencement".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-17',
    level: 'B1',
    question: 'Comment dit-on "origin" en français ?',
    options: ['Début', 'Commencement', 'Start', 'Origine'],
    correctAnswer: 'Origine',
    explanation: 'La traduction correcte de "origin" est "Origine".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-18',
    level: 'B1',
    question: 'Comment dit-on "development" en français ?',
    options: ['Développement', 'Croissance', 'Évolution', 'Progrès'],
    correctAnswer: 'Développement',
    explanation: 'La traduction correcte de "development" est "Développement".',
    category: 'vocabulary',
    difficulty: 'medium'
  },

  // Level B2 - Grammar (Advanced)
  {
    id: 'B2-G-1',
    level: 'B2',
    question: 'Quelle est la forme correcte du subjonctif imparfait du verbe "être" ?',
    options: ['Je fusse', 'Je sois', 'J\'étais', 'Je serais'],
    correctAnswer: 'Je fusse',
    explanation: 'Le subjonctif imparfait du verbe "être" est "je fusse".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-2',
    level: 'B2',
    question: 'Quelle est la forme correcte du subjonctif imparfait du verbe "avoir" ?',
    options: ['J\'eusse', 'J\'aie', 'J\'avais', 'J\'aurais'],
    correctAnswer: 'J\'eusse',
    explanation: 'Le subjonctif imparfait du verbe "avoir" est "j\'eusse".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-3',
    level: 'B2',
    question: 'Quelle est la forme correcte du participe présent du verbe "faire" ?',
    options: ['Faisant', 'Fait', 'Fais', 'Faisais'],
    correctAnswer: 'Faisant',
    explanation: 'Le participe présent du verbe "faire" est "faisant".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-4',
    level: 'B2',
    question: 'Quelle est la forme correcte du gérondif du verbe "aller" ?',
    options: ['Allant', 'Allé', 'Vais', 'Allais'],
    correctAnswer: 'Allant',
    explanation: 'Le gérondif du verbe "aller" est "allant".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-5',
    level: 'B2',
    question: 'Quelle est la forme correcte de l\'infinitif passé du verbe "être" ?',
    options: ['Être', 'Avoir été', 'Étant', 'Été'],
    correctAnswer: 'Avoir été',
    explanation: 'L\'infinitif passé du verbe "être" est "avoir été".',
    category: 'grammar',
    difficulty: 'hard'
  },

  // Level B2 - Vocabulary (Advanced)
  {
    id: 'B2-V-1',
    level: 'B2',
    question: 'Comment dit-on "accomplishment" en français ?',
    options: ['Réalisation', 'Accomplissement', 'Succès', 'Résultat'],
    correctAnswer: 'Accomplissement',
    explanation: 'La traduction correcte de "accomplishment" est "Accomplissement".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-2',
    level: 'B2',
    question: 'Comment dit-on "achievement" en français ?',
    options: ['Accomplissement', 'Réalisation', 'Succès', 'Résultat'],
    correctAnswer: 'Réalisation',
    explanation: 'La traduction correcte de "achievement" est "Réalisation".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-3',
    level: 'B2',
    question: 'Comment dit-on "success" en français ?',
    options: ['Accomplissement', 'Réalisation', 'Succès', 'Résultat'],
    correctAnswer: 'Succès',
    explanation: 'La traduction correcte de "success" est "Succès".',
    category: 'vocabulary',
    difficulty: 'hard'
  },

  // Level C1 - Grammar (Expert)
  {
    id: 'C1-G-1',
    level: 'C1',
    question: 'Quelle est la forme correcte du subjonctif plus-que-parfait du verbe "être" ?',
    options: ['J\'eusse été', 'J\'aie été', 'J\'avais été', 'J\'aurais été'],
    correctAnswer: 'J\'eusse été',
    explanation: 'Le subjonctif plus-que-parfait du verbe "être" est "j\'eusse été".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-2',
    level: 'C1',
    question: 'Quelle est la forme correcte du subjonctif plus-que-parfait du verbe "avoir" ?',
    options: ['J\'eusse eu', 'J\'aie eu', 'J\'avais eu', 'J\'aurais eu'],
    correctAnswer: 'J\'eusse eu',
    explanation: 'Le subjonctif plus-que-parfait du verbe "avoir" est "j\'eusse eu".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-3',
    level: 'C1',
    question: 'Quelle est la forme correcte du conditionnel passé deuxième forme du verbe "être" ?',
    options: ['J\'eusse été', 'J\'aurais été', 'J\'avais été', 'J\'aie été'],
    correctAnswer: 'J\'eusse été',
    explanation: 'Le conditionnel passé deuxième forme du verbe "être" est "j\'eusse été".',
    category: 'grammar',
    difficulty: 'hard'
  },

  // Level C1 - Vocabulary (Expert)
  {
    id: 'C1-V-1',
    level: 'C1',
    question: 'Comment dit-on "sophistication" en français ?',
    options: ['Raffinement', 'Sophistication', 'Élégance', 'Complexité'],
    correctAnswer: 'Raffinement',
    explanation: 'La traduction correcte de "sophistication" est "Raffinement".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-2',
    level: 'C1',
    question: 'Comment dit-on "nuance" en français ?',
    options: ['Nuance', 'Détail', 'Différence', 'Variation'],
    correctAnswer: 'Nuance',
    explanation: 'La traduction correcte de "nuance" est "Nuance".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-3',
    level: 'C1',
    question: 'Comment dit-on "eloquence" en français ?',
    options: ['Éloquence', 'Eloquence', 'Articulation', 'Expression'],
    correctAnswer: 'Éloquence',
    explanation: 'La traduction correcte de "eloquence" est "Éloquence".',
    category: 'vocabulary',
    difficulty: 'hard'
  },

  // Level C2 - Grammar (Mastery)
  {
    id: 'C2-G-1',
    level: 'C2',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "falloir" ?',
    options: ['Il faille', 'Il faut', 'Il fallait', 'Il faudra'],
    correctAnswer: 'Il faille',
    explanation: 'Le subjonctif présent du verbe "falloir" est "il faille".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-2',
    level: 'C2',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "pleuvoir" ?',
    options: ['Il pleuve', 'Il pleut', 'Il pleuvait', 'Il pleuvra'],
    correctAnswer: 'Il pleuve',
    explanation: 'Le subjonctif présent du verbe "pleuvoir" est "il pleuve".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-3',
    level: 'C2',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "valoir" ?',
    options: ['Il vaille', 'Il vaut', 'Il valait', 'Il vaudra'],
    correctAnswer: 'Il vaille',
    explanation: 'Le subjonctif présent du verbe "valoir" est "il vaille".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-4',
    level: 'C2',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "pouvoir" ?',
    options: ['Je puisse', 'Je peux', 'Je pouvais', 'Je pourrai'],
    correctAnswer: 'Je puisse',
    explanation: 'Le subjonctif présent du verbe "pouvoir" est "je puisse".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-5',
    level: 'C2',
    question: 'Quelle est la forme correcte du subjonctif présent du verbe "vouloir" ?',
    options: ['Je veuille', 'Je veux', 'Je voulais', 'Je voudrai'],
    correctAnswer: 'Je veuille',
    explanation: 'Le subjonctif présent du verbe "vouloir" est "je veuille".',
    category: 'grammar',
    difficulty: 'hard'
  },

  // Level C2 - Vocabulary (Mastery)
  {
    id: 'C2-V-1',
    level: 'C2',
    question: 'Comment dit-on "perspicacity" en français ?',
    options: ['Perspicacité', 'Clairvoyance', 'Intuition', 'Sagacité'],
    correctAnswer: 'Perspicacité',
    explanation: 'La traduction correcte de "perspicacity" est "Perspicacité".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-2',
    level: 'C2',
    question: 'Comment dit-on "sagacity" en français ?',
    options: ['Perspicacité', 'Clairvoyance', 'Intuition', 'Sagacité'],
    correctAnswer: 'Sagacité',
    explanation: 'La traduction correcte de "sagacity" est "Sagacité".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-3',
    level: 'C2',
    question: 'Comment dit-on "acumen" en français ?',
    options: ['Perspicacité', 'Clairvoyance', 'Intuition', 'Sagacité'],
    correctAnswer: 'Clairvoyance',
    explanation: 'La traduction correcte de "acumen" est "Clairvoyance".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-4',
    level: 'C2',
    question: 'Comment dit-on "intuition" en français ?',
    options: ['Perspicacité', 'Clairvoyance', 'Intuition', 'Sagacité'],
    correctAnswer: 'Intuition',
    explanation: 'La traduction correcte de "intuition" est "Intuition".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-5',
    level: 'C2',
    question: 'Comment dit-on "erudition" en français ?',
    options: ['Érudition', 'Savoir', 'Connaissance', 'Science'],
    correctAnswer: 'Érudition',
    explanation: 'La traduction correcte de "erudition" est "Érudition".',
    category: 'vocabulary',
    difficulty: 'hard'
  }
];

// Helper functions for question selection
export function getRandomQuestions(count: number = 80, level?: string, category?: string): TestQuestion[] {
  let filteredQuestions = FRENCH_PROFICIENCY_QUESTIONS;
  
  if (level) {
    filteredQuestions = filteredQuestions.filter(q => q.level === level);
  }
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionsByLevel(level: string): TestQuestion[] {
  return FRENCH_PROFICIENCY_QUESTIONS.filter(q => q.level === level);
}

export function getQuestionsByCategory(category: string): TestQuestion[] {
  return FRENCH_PROFICIENCY_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestQuestion[] {
  return FRENCH_PROFICIENCY_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getBalancedQuestionSet(count: number = 80): TestQuestion[] {
  // Get questions from each level to ensure balanced coverage
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const questionsPerLevel = Math.floor(count / levels.length);
  const remainingQuestions = count % levels.length;
  
  let selectedQuestions: TestQuestion[] = [];
  
  levels.forEach((level, index) => {
    const levelQuestions = getQuestionsByLevel(level);
    const questionsToTake = questionsPerLevel + (index < remainingQuestions ? 1 : 0);
    const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, questionsToTake));
  });
  
  // Shuffle the final selection
  return selectedQuestions.sort(() => 0.5 - Math.random());
} 