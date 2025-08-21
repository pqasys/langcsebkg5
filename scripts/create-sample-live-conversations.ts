#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding sample Live Conversations...')

  const now = new Date()
  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const in26Hours = new Date(now.getTime() + 26 * 60 * 60 * 1000)

  const host = await prisma.user.findFirst({ where: { role: { in: ['ADMIN', 'INSTRUCTOR'] } } })
  if (!host) {
    throw new Error('No host user found (need an ADMIN or INSTRUCTOR user)')
  }

  // GROUP sample (English, B1)
  const group = await prisma.liveConversation.create({
    data: {
      title: 'B1 English Group Practice — Travel and Directions',
      description: 'Practice asking for directions and describing routes in English.',
      conversationType: 'GROUP',
      language: 'en',
      level: 'CEFR_B1',
      startTime: in2Hours,
      endTime: new Date(in2Hours.getTime() + 45 * 60 * 1000),
      duration: 45,
      maxParticipants: 6,
      currentParticipants: 0,
      price: 0,
      isPublic: true,
      isFree: true,
      status: 'SCHEDULED',
      hostId: host.id,
      topic: 'Travel & Directions',
      conversationPrompts: [
        'How do I get to the train station from here?',
        'Describe your route to work or school.',
      ] as any,
      vocabularyList: ['intersection', 'roundabout', 'landmark'] as any,
      grammarPoints: ['imperatives', 'prepositions of movement'] as any,
    }
  })

  // PRIVATE sample (Spanish, A2)
  const oneToOne = await prisma.liveConversation.create({
    data: {
      title: 'A2 Spanish 1:1 — Ordering Food',
      description: 'Role-play a restaurant scenario and practice common phrases.',
      conversationType: 'PRIVATE',
      language: 'es',
      level: 'CEFR_A2',
      startTime: in26Hours,
      endTime: new Date(in26Hours.getTime() + 30 * 60 * 1000),
      duration: 30,
      maxParticipants: 2,
      currentParticipants: 0,
      price: 15,
      isPublic: false,
      isFree: false,
      status: 'SCHEDULED',
      hostId: host.id,
      topic: 'At the Restaurant',
      conversationPrompts: [
        'Order a three-course meal politely.',
        'Ask for recommendations and the bill.',
      ] as any,
      vocabularyList: ['cuenta', 'camarero', 'entrante', 'postre'] as any,
      grammarPoints: ['usted vs tú', 'por vs para'] as any,
    }
  })

  console.log('Created sample sessions:', { group: group.id, oneToOne: oneToOne.id })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
