import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find a host user to associate; prefer admin, otherwise any user
  const host = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true }
  }) || await prisma.user.findFirst({ select: { id: true } })

  if (!host?.id) {
    throw new Error('No user found to host the conversation. Please create a user first.')
  }

  // Find a participant user (non-admin preferred)
  const participant = await prisma.user.findFirst({
    where: { NOT: { id: host.id } },
    select: { id: true }
  }) || host

  const now = Date.now()
  const start = new Date(now + 60 * 60 * 1000) // +1h
  const end = new Date(now + 2 * 60 * 60 * 1000) // +2h

  // Upsert conversation
  await prisma.liveConversation.upsert({
    where: { id: 'conv-001' },
    update: {
      startTime: start,
      endTime: end,
      updatedAt: new Date()
    },
    create: {
      id: 'conv-001',
      title: 'Beginner Spanish Conversation',
      description: 'Practice basic Spanish conversation skills with fellow beginners. We\'ll cover greetings, introductions, and everyday topics.',
      conversationType: 'GROUP',
      language: 'es',
      level: 'CEFR_A1',
      startTime: start,
      endTime: end,
      duration: 60,
      maxParticipants: 8,
      currentParticipants: 0,
      price: 0,
      isPublic: true,
      isFree: true,
      status: 'SCHEDULED',
      hostId: host.id,
      topic: 'Basic Introductions',
    }
  })

  // Create or ensure booking for participant
  await prisma.liveConversationBooking.upsert({
    where: {
      conversationId_userId: { conversationId: 'conv-001', userId: participant.id }
    },
    update: { status: 'CONFIRMED', paymentStatus: 'PAID' },
    create: {
      conversationId: 'conv-001',
      userId: participant.id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      amount: 0,
      currency: 'USD'
    }
  })

  // Update currentParticipants to reflect at least 1 participant
  const counts = await prisma.liveConversationBooking.count({ where: { conversationId: 'conv-001', status: 'CONFIRMED' } })

  await prisma.liveConversation.update({
    where: { id: 'conv-001' },
    data: { currentParticipants: counts }
  })

  console.log('Live conversation conv-001 upserted with booking for user:', participant.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


