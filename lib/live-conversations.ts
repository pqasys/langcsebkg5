import { LiveConversation, LiveConversationBooking, LiveConversationParticipant } from '@prisma/client'

export type ConversationType = 'GROUP' | 'PRIVATE' | 'PRACTICE' | 'CULTURAL'
export type ConversationStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface LiveConversationDTO {
  id: string
  title: string
  description?: string | null
  conversationType: ConversationType
  language: string
  level: string
  startTime: string
  endTime: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isPublic: boolean
  isFree: boolean
  status: ConversationStatus
  topic?: string | null
  culturalNotes?: string | null
  vocabularyList?: string[] | null
  grammarPoints?: string[] | null
  conversationPrompts?: string[] | null
  meetingUrl?: string | null
  meetingId?: string | null
}

export interface LiveConversationUsageSummary {
  group: number
  oneToOne: number
  minutes: number
  ent: {
    groupCap: number
    oneToOneCap: number
    minutesCap: number
  }
}

export function mapConversationRow(row: LiveConversation): LiveConversationDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    conversationType: row.conversationType as ConversationType,
    language: row.language,
    level: row.level,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    duration: row.duration,
    maxParticipants: row.maxParticipants,
    currentParticipants: row.currentParticipants,
    price: row.price,
    isPublic: row.isPublic,
    isFree: row.isFree,
    status: row.status as ConversationStatus,
    topic: row.topic ?? null,
    culturalNotes: row.culturalNotes ?? null,
    vocabularyList: (row.vocabularyList as any) ?? null,
    grammarPoints: (row.grammarPoints as any) ?? null,
    conversationPrompts: (row.conversationPrompts as any) ?? null,
    meetingUrl: row.meetingUrl ?? null,
    meetingId: row.meetingId ?? null,
  }
}
