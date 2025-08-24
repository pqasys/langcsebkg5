import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addConnectionIncentiveNotificationTemplates() {
  console.log('Adding connection incentive notification templates...')

  const incentiveTemplates = [
    {
      name: 'achievement_unlocked',
      title: 'Achievement Unlocked! 🎉',
      message: 'Congratulations! You\'ve unlocked the "{achievementTitle}" achievement and earned {points} points!',
      category: 'achievement',
      variables: ['achievementTitle', 'achievementDescription', 'points']
    },
    {
      name: 'reward_redeemed',
      title: 'Reward Redeemed! 🎁',
      message: 'You\'ve successfully redeemed "{rewardTitle}"! Check your account for details.',
      category: 'reward',
      variables: ['rewardTitle', 'rewardDescription']
    },
    {
      name: 'points_earned',
      title: 'Points Earned! ⭐',
      message: 'You\'ve earned {points} points for {activity}! Keep up the great work!',
      category: 'points',
      variables: ['points', 'activity', 'description']
    },
    {
      name: 'connection_milestone',
      title: 'Connection Milestone! 🌟',
      message: 'You\'ve reached {milestone} connections! You\'re building an amazing learning network!',
      category: 'connection',
      variables: ['milestone', 'totalConnections']
    }
  ]

  for (const template of incentiveTemplates) {
    try {
      await prisma.notificationTemplate.upsert({
        where: { name: template.name },
        update: {
          title: template.title,
          content: template.message,
          category: template.category,
          variables: template.variables
        },
        create: {
          name: template.name,
          title: template.title,
          content: template.message,
          category: template.category,
          variables: template.variables,
          type: 'SYSTEM',
          createdBy: 'system'
        }
      })
      console.log(`✅ Added/updated template: ${template.name}`)
    } catch (error) {
      console.error(`❌ Error adding template ${template.name}:`, error)
    }
  }

  console.log('Connection incentive notification templates added successfully!')
}

async function main() {
  try {
    await addConnectionIncentiveNotificationTemplates()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
