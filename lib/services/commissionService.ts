import { prisma } from '@/lib/prisma';

export interface CommissionCalculation {
  totalRevenue: number;
  commissionAmount: number;
  commissionRate: number;
  participantCount: number;
  isCreditBased: boolean;
  creditPrice: number;
}

export interface PayoutCalculation {
  totalAmount: number;
  commissionCount: number;
  commissionIds: string[];
}

export class CommissionService {
  /**
   * Calculate instructor commission for a live class session
   */
  static async calculateInstructorCommission(sessionId: string): Promise<CommissionCalculation> {
    const session = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: {
        attendances: {
          where: { attended: true }
        },
        participants: {
          where: { isActive: true }
        }
      }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const attendanceCount = session.attendances.length;
    const participantCount = session.participants.length;
    const isCreditBased = session.isCreditBased;
    const creditPrice = session.creditPrice || 30;
    const commissionRate = session.instructorCommissionRate || 70.0;

    let totalRevenue = 0;
    let commissionAmount = 0;

    if (isCreditBased) {
      totalRevenue = participantCount * creditPrice; // 1 credit = $1
      commissionAmount = (totalRevenue * commissionRate) / 100;
    } else {
      totalRevenue = session.price * participantCount;
      commissionAmount = (totalRevenue * commissionRate) / 100;
    }

    return {
      totalRevenue,
      commissionAmount,
      commissionRate,
      participantCount,
      isCreditBased,
      creditPrice
    };
  }

  /**
   * Calculate host commission for a live conversation
   */
  static async calculateHostCommission(conversationId: string): Promise<CommissionCalculation> {
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          where: { status: 'JOINED' }
        },
        bookings: {
          where: { status: 'CONFIRMED' }
        }
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const participantCount = conversation.participants.length;
    const bookingCount = conversation.bookings.length;
    const isCreditBased = conversation.isCreditBased;
    const creditPrice = conversation.creditPrice || 25;
    const commissionRate = conversation.hostCommissionRate || 70.0;

    let totalRevenue = 0;
    let commissionAmount = 0;

    if (isCreditBased) {
      totalRevenue = participantCount * creditPrice; // 1 credit = $1
      commissionAmount = (totalRevenue * commissionRate) / 100;
    } else {
      totalRevenue = conversation.price * bookingCount;
      commissionAmount = (totalRevenue * commissionRate) / 100;
    }

    return {
      totalRevenue,
      commissionAmount,
      commissionRate,
      participantCount,
      isCreditBased,
      creditPrice
    };
  }

  /**
   * Create instructor commission record
   */
  static async createInstructorCommission(
    instructorId: string,
    sessionId: string,
    calculation: CommissionCalculation
  ) {
    const session = await prisma.videoSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Check if commission already exists
    const existingCommission = await prisma.instructorCommission.findFirst({
      where: {
        sessionId: sessionId,
        instructorId: instructorId
      }
    });

    if (existingCommission) {
      return existingCommission;
    }

    return await prisma.instructorCommission.create({
      data: {
        instructorId: instructorId,
        sessionId: sessionId,
        sessionPrice: session.price,
        creditPrice: calculation.creditPrice,
        commissionAmount: calculation.commissionAmount,
        commissionRate: calculation.commissionRate,
        status: 'PENDING',
        sessionType: 'LIVE_CLASS',
        metadata: {
          participantCount: calculation.participantCount,
          isCreditBased: calculation.isCreditBased,
          calculatedAt: new Date().toISOString()
        }
      }
    });
  }

  /**
   * Create host commission record
   */
  static async createHostCommission(
    hostId: string,
    conversationId: string,
    calculation: CommissionCalculation
  ) {
    const conversation = await prisma.liveConversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if commission already exists
    const existingCommission = await prisma.hostCommission.findFirst({
      where: {
        conversationId: conversationId,
        hostId: hostId
      }
    });

    if (existingCommission) {
      return existingCommission;
    }

    return await prisma.hostCommission.create({
      data: {
        hostId: hostId,
        conversationId: conversationId,
        sessionPrice: conversation.price,
        creditPrice: calculation.creditPrice,
        commissionAmount: calculation.commissionAmount,
        commissionRate: calculation.commissionRate,
        status: 'PENDING',
        metadata: {
          participantCount: calculation.participantCount,
          isCreditBased: calculation.isCreditBased,
          calculatedAt: new Date().toISOString()
        }
      }
    });
  }

  /**
   * Calculate payout for instructor
   */
  static async calculateInstructorPayout(instructorId: string, commissionIds: string[]): Promise<PayoutCalculation> {
    const pendingCommissions = await prisma.instructorCommission.findMany({
      where: {
        id: { in: commissionIds },
        instructorId: instructorId,
        status: 'PENDING'
      }
    });

    if (pendingCommissions.length === 0) {
      throw new Error('No pending commissions found');
    }

    const totalAmount = pendingCommissions.reduce(
      (sum, commission) => sum + commission.commissionAmount, 
      0
    );

    return {
      totalAmount,
      commissionCount: pendingCommissions.length,
      commissionIds: pendingCommissions.map(c => c.id)
    };
  }

  /**
   * Calculate payout for host
   */
  static async calculateHostPayout(hostId: string, commissionIds: string[]): Promise<PayoutCalculation> {
    const pendingCommissions = await prisma.hostCommission.findMany({
      where: {
        id: { in: commissionIds },
        hostId: hostId,
        status: 'PENDING'
      }
    });

    if (pendingCommissions.length === 0) {
      throw new Error('No pending commissions found');
    }

    const totalAmount = pendingCommissions.reduce(
      (sum, commission) => sum + commission.commissionAmount, 
      0
    );

    return {
      totalAmount,
      commissionCount: pendingCommissions.length,
      commissionIds: pendingCommissions.map(c => c.id)
    };
  }

  /**
   * Get commission statistics
   */
  static async getCommissionStats() {
    const [
      instructorCommissions,
      hostCommissions,
      instructorPayouts,
      hostPayouts
    ] = await Promise.all([
      prisma.instructorCommission.findMany(),
      prisma.hostCommission.findMany(),
      prisma.instructorPayout.findMany(),
      prisma.hostPayout.findMany()
    ]);

    const allCommissions = [...instructorCommissions, ...hostCommissions];
    const allPayouts = [...instructorPayouts, ...hostPayouts];

    return {
      totalCommissions: allCommissions.length,
      pendingCommissions: allCommissions.filter(c => c.status === 'PENDING').length,
      paidCommissions: allCommissions.filter(c => c.status === 'PAID').length,
      totalPayouts: allPayouts.length,
      pendingPayouts: allPayouts.filter(p => p.status === 'PENDING').length,
      completedPayouts: allPayouts.filter(p => p.status === 'COMPLETED').length,
      totalCommissionAmount: allCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      totalPayoutAmount: allPayouts.reduce((sum, p) => sum + p.amount, 0)
    };
  }

  /**
   * Get commission tiers for instructor
   */
  static async getInstructorCommissionTier(instructorId: string) {
    const tier = await prisma.instructorCommissionTier.findFirst({
      where: {
        instructorId: instructorId,
        effectiveDate: { lte: new Date() },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      orderBy: { effectiveDate: 'desc' }
    });

    return tier || { commissionRate: 70.0, tierName: 'DEFAULT' };
  }

  /**
   * Get commission tiers for host
   */
  static async getHostCommissionTier(hostId: string) {
    const tier = await prisma.hostCommissionTier.findFirst({
      where: {
        hostId: hostId,
        effectiveDate: { lte: new Date() },
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      orderBy: { effectiveDate: 'desc' }
    });

    return tier || { commissionRate: 70.0, tierName: 'DEFAULT' };
  }
}
