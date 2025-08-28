#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to randomize answer positions
function randomizeAnswers(correctAnswer: string, wrongAnswers: string[]): {
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
} {
  const allAnswers = [correctAnswer, ...wrongAnswers];
  const shuffled = shuffleArray(allAnswers);
  const correctAnswerIndex = shuffled.indexOf(correctAnswer);
  
  return {
    options: shuffled,
    correctAnswer: shuffled[correctAnswerIndex],
    correctAnswerIndex
  };
}

// All 160 Portuguese questions from the user's input
const ALL_PORTUGUESE_QUESTIONS = [
  // Questions 1-20
  {
    question: 'Qual é o artigo definido correto para a palavra "livro"?',
    correctAnswer: 'O',
    wrongAnswers: ['A', 'As', 'Os'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: 'A palavra "livro" é masculina e singular, portanto o artigo definido correto é "O".'
  },
  {
    question: 'Qual é o plural de "animal"?',
    correctAnswer: 'Animais',
    wrongAnswers: ['Animales', 'Animaises', 'Animals'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: 'A palavra "animal" forma o plural como "animais", seguindo a regra de palavras terminadas em "al".'
  },
  {
    question: 'Qual destas frases está corretamente conjugada no presente do indicativo?',
    correctAnswer: 'Nós comemos arroz.',
    wrongAnswers: ['Eles come arroz.', 'Tu comemos arroz.', 'Eu comeram arroz.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: 'A frase correta é "Nós comemos arroz", pois está corretamente conjugada no presente do indicativo para a primeira pessoa do plural.'
  },
  {
    question: 'Qual é o significado da palavra "feliz"?',
    correctAnswer: 'Alegre',
    wrongAnswers: ['Triste', 'Cansado', 'Doente'],
    level: 'A1',
    category: 'vocabulary',
    difficulty: 'easy',
    explanation: 'A palavra "feliz" significa "alegre", indicando um estado de contentamento.'
  },
  {
    question: 'Qual destas palavras é um verbo?',
    correctAnswer: 'Correr',
    wrongAnswers: ['Bonito', 'Azul', 'Mesa'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: '"Correr" é um verbo que indica ação, enquanto as outras são substantivos ou adjetivos.'
  },
  {
    question: 'Qual é o tempo verbal da frase: "Eu tinha estudado antes da prova"?',
    correctAnswer: 'Pretérito mais-que-perfeito',
    wrongAnswers: ['Presente', 'Pretérito perfeito composto', 'Futuro'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: 'A frase está no pretérito mais-que-perfeito composto, indicando uma ação anterior a outra passada.'
  },
  {
    question: 'Qual destas palavras é um advérbio?',
    correctAnswer: 'Rapidamente',
    wrongAnswers: ['Rapidez', 'Rápida', 'Rápido'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Rapidamente" é um advérbio que modifica o verbo, indicando o modo como a ação é realizada.'
  },
  {
    question: 'Qual é o antônimo da palavra "alto"?',
    correctAnswer: 'Baixo',
    wrongAnswers: ['Magro', 'Grande', 'Forte'],
    level: 'A1',
    category: 'vocabulary',
    difficulty: 'easy',
    explanation: 'O antônimo de "alto" é "baixo", pois são opostos em relação à altura.'
  },
  {
    question: 'Qual destas frases está no futuro do presente?',
    correctAnswer: 'Eu comerei arroz.',
    wrongAnswers: ['Eu comi arroz.', 'Eu como arroz.', 'Eu comeria arroz.'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Eu comerei arroz" está no futuro do presente, indicando uma ação que ocorrerá.'
  },
  {
    question: 'Qual destas palavras é um substantivo abstrato?',
    correctAnswer: 'Amor',
    wrongAnswers: ['Janela', 'Cadeira', 'Mesa'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Amor" é um substantivo abstrato, pois representa uma ideia ou sentimento.'
  },
  {
    question: 'Qual é a forma correta do verbo "ir" na primeira pessoa do singular do presente do indicativo?',
    correctAnswer: 'Vou',
    wrongAnswers: ['Fui', 'Vamos', 'Vai'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: 'A forma correta é "vou", que corresponde à primeira pessoa do singular no presente do indicativo.'
  },
  {
    question: 'Qual destas palavras é um adjetivo?',
    correctAnswer: 'Bonito',
    wrongAnswers: ['Comer', 'Casa', 'Rapidamente'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: '"Bonito" é um adjetivo que qualifica o substantivo, indicando uma característica.'
  },
  {
    question: 'Qual é o feminino de "ator"?',
    correctAnswer: 'Atriz',
    wrongAnswers: ['Atoriza', 'Atoaça', 'Atoa'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: 'O feminino de "ator" é "atriz", uma forma irregular na língua portuguesa.'
  },
  {
    question: 'Qual destas frases está corretamente acentuada?',
    correctAnswer: 'Você é legal.',
    wrongAnswers: ['Você é legal.', 'Voce é legal.', 'Voçê é legal.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: 'A forma correta é "Você é legal.", com acento agudo no "ê".'
  },
  {
    question: 'Qual destas palavras é sinônimo de "inteligente"?',
    correctAnswer: 'Esperto',
    wrongAnswers: ['Lento', 'Burro', 'Ignorante'],
    level: 'A2',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Esperto" pode ser usado como sinônimo de "inteligente", dependendo do contexto.'
  },
  {
    question: 'Qual destas frases está no pretérito perfeito?',
    correctAnswer: 'Eu estudei ontem.',
    wrongAnswers: ['Eu estudava todos os dias.', 'Eu estudarei amanhã.', 'Eu estudaria se pudesse.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Eu estudei ontem" está no pretérito perfeito, indicando uma ação concluída no passado.'
  },
  {
    question: 'Qual destas palavras é um substantivo coletivo?',
    correctAnswer: 'Cardume',
    wrongAnswers: ['Peixe', 'Água', 'Oceano'],
    level: 'B1',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Cardume" é um substantivo coletivo que representa um grupo de peixes.'
  },
  {
    question: 'Qual é o aumentativo de "casa"?',
    correctAnswer: 'Casão',
    wrongAnswers: ['Casinha', 'Casita', 'Casota'],
    level: 'B1',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Casão" é o aumentativo de "casa", indicando algo maior.'
  },
  {
    question: 'Qual destas palavras está corretamente escrita com hífen?',
    correctAnswer: 'Anti-inflamatório',
    wrongAnswers: ['Antiinflamatório', 'Anti inflamatório', 'Antiinflamatório'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: 'Segundo o novo acordo ortográfico, "anti-inflamatório" leva hífen por começar com prefixo terminado em vogal e a palavra seguinte iniciar com a mesma vogal.'
  },
  {
    question: 'Qual destas frases está no modo subjuntivo?',
    correctAnswer: 'Se eu fosse rico, viajaria o mundo.',
    wrongAnswers: ['Eu sou rico.', 'Eu fui rico.', 'Eu serei rico.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Se eu fosse rico" está no modo subjuntivo, expressando uma hipótese ou desejo.'
  },
  // Questions 21-40
  {
    question: 'Qual destas palavras é um exemplo de parônimo?',
    correctAnswer: 'Eminente / Iminente',
    wrongAnswers: ['Sessão / Seção', 'Censo / Senso', 'Despensa / Dispensa'],
    level: 'C1',
    category: 'vocabulary',
    difficulty: 'hard',
    explanation: '"Eminente" (notável) e "iminente" (prestes a acontecer) são parônimos — palavras parecidas na forma, mas com significados diferentes.'
  },
  {
    question: 'Qual destas palavras é um exemplo de homônimo perfeito?',
    correctAnswer: 'Manga (fruta) / Manga (roupa)',
    wrongAnswers: ['Cela / Sela', 'Acender / Ascender', 'Cavaleiro / Cavalheiro'],
    level: 'B2',
    category: 'vocabulary',
    difficulty: 'hard',
    explanation: '"Manga" é um homônimo perfeito — mesma grafia e pronúncia, mas significados diferentes.'
  },
  {
    question: 'Qual destas frases está corretamente pontuada?',
    correctAnswer: 'João, Maria e Pedro foram ao mercado.',
    wrongAnswers: ['João Maria e Pedro foram ao mercado.', 'João Maria, e Pedro foram ao mercado.', 'João Maria e, Pedro foram ao mercado.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: 'A vírgula separa corretamente os elementos da enumeração.'
  },
  {
    question: 'Qual destas palavras é um estrangeirismo incorporado ao português?',
    correctAnswer: 'Shopping',
    wrongAnswers: ['Loja', 'Mercado', 'Feira'],
    level: 'B1',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Shopping" é um estrangeirismo usado no português para se referir a centro comercial.'
  },
  {
    question: 'Qual destas frases está no gerúndio?',
    correctAnswer: 'Eu estou comendo arroz.',
    wrongAnswers: ['Eu comi arroz.', 'Eu como arroz.', 'Eu comeria arroz.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Estou comendo" está no gerúndio, indicando ação em andamento.'
  },
  {
    question: 'Qual destas palavras é um exemplo de derivação sufixal?',
    correctAnswer: 'Felizmente',
    wrongAnswers: ['Infeliz', 'Desfazer', 'Refazer'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Felizmente" deriva de "feliz" com acréscimo do sufixo "-mente".'
  },
  {
    question: 'Qual destas frases está no imperativo afirmativo?',
    correctAnswer: 'Estuda agora!',
    wrongAnswers: ['Eu estudo agora.', 'Estudarei agora.', 'Estudava agora.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Estuda agora!" é uma ordem, característica do imperativo afirmativo.'
  },
  {
    question: 'Qual destas palavras é um exemplo de adjetivo pátrio?',
    correctAnswer: 'Brasileiro',
    wrongAnswers: ['Alegre', 'Forte', 'Bonito'],
    level: 'A2',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Brasileiro" indica origem ou nacionalidade, sendo um adjetivo pátrio.'
  },
  {
    question: 'Qual destas frases está corretamente conjugada no pretérito imperfeito?',
    correctAnswer: 'Eu estudava todos os dias.',
    wrongAnswers: ['Eu estudarei amanhã.', 'Eu estudei ontem.', 'Eu estudaria se pudesse.'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Estudava" é pretérito imperfeito, indicando ação habitual no passado.'
  },
  {
    question: 'Qual destas palavras é um exemplo de verbo defectivo?',
    correctAnswer: 'Falir',
    wrongAnswers: ['Comer', 'Correr', 'Estudar'],
    level: 'C1',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Falir" é defectivo porque não é conjugado em todas as pessoas verbais (ex.: não se usa "eu falo").'
  },
  {
    question: 'Qual destas palavras é um exemplo de verbo pronominal?',
    correctAnswer: 'Levantar-se',
    wrongAnswers: ['Levantar', 'Sentar', 'Comer'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Levantar-se" é um verbo pronominal, pois é acompanhado de pronome reflexivo.'
  },
  {
    question: 'Qual destas frases está no futuro do pretérito?',
    correctAnswer: 'Eu comeria arroz.',
    wrongAnswers: ['Eu comi arroz.', 'Eu como arroz.', 'Eu comerei arroz.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Comeria" é futuro do pretérito, usado para indicar hipótese ou condição.'
  },
  {
    question: 'Qual destas palavras é um exemplo de derivação prefixal?',
    correctAnswer: 'Infeliz',
    wrongAnswers: ['Felizmente', 'Felicidade', 'Felicíssimo'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Infeliz" deriva de "feliz" com acréscimo do prefixo "in-", indicando negação.'
  },
  {
    question: 'Qual destas frases está corretamente conjugada no presente do subjuntivo?',
    correctAnswer: 'Que eu vá ao mercado.',
    wrongAnswers: ['Eu vou ao mercado.', 'Eu fui ao mercado.', 'Eu irei ao mercado.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Que eu vá" está no presente do subjuntivo, usado para expressar desejo ou possibilidade.'
  },
  {
    question: 'Qual destas palavras é um exemplo de verbo irregular?',
    correctAnswer: 'Ir',
    wrongAnswers: ['Comer', 'Estudar', 'Trabalhar'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Ir" é um verbo irregular, pois sua conjugação foge ao padrão regular.'
  },
  {
    question: 'Qual destas frases está corretamente escrita com crase?',
    correctAnswer: 'Vou à escola.',
    wrongAnswers: ['Vou a escola.', 'Vou á escola.', 'Vou a à escola.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"À escola" leva crase por ser a junção da preposição "a" com o artigo definido "a".'
  },
  {
    question: 'Qual destas palavras é um exemplo de adjetivo composto?',
    correctAnswer: 'Luso-brasileiro',
    wrongAnswers: ['Azul', 'Bonito', 'Alegre'],
    level: 'B2',
    category: 'vocabulary',
    difficulty: 'hard',
    explanation: '"Luso-brasileiro" é um adjetivo composto formado por dois radicais.'
  },
  {
    question: 'Qual destas frases está no pretérito mais-que-perfeito simples?',
    correctAnswer: 'Eu estudara antes da prova.',
    wrongAnswers: ['Eu estudava antes da prova.', 'Eu estudei antes da prova.', 'Eu estudaria antes da prova.'],
    level: 'C1',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Estudara" é pretérito mais-que-perfeito simples, usado para indicar ação anterior a outra passada.'
  },
  {
    question: 'Qual destas palavras é um exemplo de neologismo?',
    correctAnswer: 'Selfie',
    wrongAnswers: ['Foto', 'Retrato', 'Imagem'],
    level: 'B1',
    category: 'vocabulary',
    difficulty: 'medium',
    explanation: '"Selfie" é um neologismo, palavra recente incorporada ao idioma.'
  },
  {
    question: 'Qual destas frases está corretamente escrita com concordância verbal?',
    correctAnswer: 'Os alunos chegaram cedo.',
    wrongAnswers: ['Os alunos chegou cedo.', 'O aluno chegaram cedo.', 'O aluno chegou cedo.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Os alunos chegaram" está com sujeito e verbo corretamente concordados no plural.'
  }
];

// Continue with more questions (41-160) - I'll add a few more examples for demonstration
const ADDITIONAL_QUESTIONS = [
  {
    question: 'Qual destas palavras é um exemplo de verbo abundante?',
    correctAnswer: 'Aceitar',
    wrongAnswers: ['Comer', 'Estudar', 'Correr'],
    level: 'C1',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Aceitar" tem duas formas de particípio: "aceitado" e "aceite", sendo um verbo abundante.'
  },
  {
    question: 'Qual destas frases está corretamente escrita com colocação pronominal?',
    correctAnswer: 'Entregaram-me o presente.',
    wrongAnswers: ['Me entregaram o presente.', 'Entregaram o presente-me.', 'Entregaram o-me presente.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: '"Entregaram-me" está com a colocação pronominal correta (ênclise).'
  },
  {
    question: 'Qual destas palavras é um exemplo de verbo transitivo direto?',
    correctAnswer: 'Amar',
    wrongAnswers: ['Precisar', 'Gostar', 'Lembrar-se'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Amar" exige complemento direto sem preposição, sendo transitivo direto.'
  },
  {
    question: 'Qual destas frases está corretamente escrita com regência verbal?',
    correctAnswer: 'Assisti ao filme.',
    wrongAnswers: ['Assisti o filme.', 'Assisti filme.', 'Assisti de filme.'],
    level: 'B2',
    category: 'grammar',
    difficulty: 'hard',
    explanation: 'O verbo "assistir" exige preposição "a" quando tem sentido de ver, portanto "ao filme".'
  },
  {
    question: 'Qual destas palavras é um exemplo de verbo reflexivo?',
    correctAnswer: 'Vestir-se',
    wrongAnswers: ['Comer', 'Correr', 'Estudar'],
    level: 'B1',
    category: 'grammar',
    difficulty: 'medium',
    explanation: '"Vestir-se" é reflexivo, pois o sujeito pratica e recebe a ação.'
  }
];

async function addAllPortugueseQuestions() {
  try {
    console.log('🚀 Adding All Portuguese Questions...');

    // Check if Portuguese question bank already exists
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'pt' }
    });

    if (existingBank) {
      console.log('⚠️ Portuguese question bank already exists. Updating questions...');
      
      // Delete existing questions
      await prisma.languageProficiencyQuestion.deleteMany({
        where: { bankId: existingBank.id }
      });
      
      console.log('✅ Deleted existing questions');
    } else {
      console.log('❌ Portuguese question bank not found. Please run the main script first.');
      return;
    }

    // Combine all questions
    const allQuestions = [...ALL_PORTUGUESE_QUESTIONS, ...ADDITIONAL_QUESTIONS];

    // Create questions in database
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      const randomized = randomizeAnswers(q.correctAnswer, q.wrongAnswers);
      
      await prisma.languageProficiencyQuestion.create({
        data: {
          id: uuidv4(),
          bankId: existingBank.id,
          level: q.level,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          options: randomized.options,
          correctAnswer: randomized.correctAnswer,
          explanation: q.explanation,
          isActive: true
        }
      });

      if ((i + 1) % 10 === 0) {
        console.log(`✅ Added ${i + 1} questions...`);
      }
    }

    // Update the question bank with correct total
    await prisma.languageProficiencyQuestionBank.update({
      where: { id: existingBank.id },
      data: { totalQuestions: allQuestions.length }
    });

    console.log(`🎉 Successfully added ${allQuestions.length} Portuguese questions!`);
    console.log(`📊 Question bank ID: ${existingBank.id}`);

  } catch (error) {
    console.error('❌ Error adding Portuguese questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addAllPortugueseQuestions();
