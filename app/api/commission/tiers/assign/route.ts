import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Assign tier to instructor based on performance
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { instructorId, hostId, tierName, tierType } = await request.json();

    if (!tierName || !tierType) {
      return NextResponse.json({ 
        error: 'Tier name and type are required' 
      }, { status: 400 });
    }

    if (tierType === 'INSTRUCTOR') {
      if (!instructorId) {
        return NextResponse.json({ 
          error: 'Instructor ID is required for instructor tier assignment' 
        }, { status: 400 });
      }

      // Get the tier
      const tier = await prisma.instructorCommissionTier.findFirst({
        where: { tierName, isActive: true }
      });

      if (!tier) {
        return NextResponse.json({ 
          error: 'Tier not found' 
        }, { status: 404 });
      }

      // End current tier assignment
      await prisma.instructorCommissionTierAssignment.updateMany({
        where: {
          instructorId,
          endDate: null
        },
        data: {
          endDate: new Date()
        }
      });

      // Create new tier assignment
      const assignment = await prisma.instructorCommissionTierAssignment.create({
        data: {
          instructorId,
          tierId: tier.id,
          startDate: new Date(),
          assignedBy: session.user.id,
          metadata: {
            assignedBy: session.user.id,
            assignedAt: new Date().toISOString(),
            reason: 'Manual assignment'
          }
        },
        include: {
          tier: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Tier assigned successfully',
        assignment
      });

    } else if (tierType === 'HOST') {
      if (!hostId) {
        return NextResponse.json({ 
          error: 'Host ID is required for host tier assignment' 
        }, { status: 400 });
      }

      // Get the tier
      const tier = await prisma.hostCommissionTier.findFirst({
        where: { tierName, isActive: true }
      });

      if (!tier) {
        return NextResponse.json({ 
          error: 'Tier not found' 
        }, { status: 404 });
      }

      // End current tier assignment
      await prisma.hostCommissionTierAssignment.updateMany({
        where: {
          hostId,
          endDate: null
        },
        data: {
          endDate: new Date()
        }
      });

      // Create new tier assignment
      const assignment = await prisma.hostCommissionTierAssignment.create({
        data: {
          hostId,
          tierId: tier.id,
          startDate: new Date(),
          assignedBy: session.user.id,
          metadata: {
            assignedBy: session.user.id,
            assignedAt: new Date().toISOString(),
            reason: 'Manual assignment'
          }
        },
        include: {
          tier: true,
          host: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Tier assigned successfully',
        assignment
      });

    } else {
      return NextResponse.json({ 
        error: 'Invalid tier type. Must be INSTRUCTOR or HOST' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error assigning tier:', error);
    return NextResponse.json(
      { error: 'Failed to assign tier' },
      { status: 500 }
    );
  }
}

// Auto-assign tiers based on performance
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { autoAssign } = await request.json();

    if (autoAssign) {
      const results = await autoAssignTiers();
      return NextResponse.json({
        message: 'Auto-assignment completed',
        results
      });
    }

    return NextResponse.json({ 
      error: 'Auto-assign parameter required' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error auto-assigning tiers:', error);
    return NextResponse.json(
      { error: 'Failed to auto-assign tiers' },
      { status: 500 }
    );
  }
}

async function autoAssignTiers() {
  const results = {
    instructors: { processed: 0, updated: 0, errors: 0 },
    hosts: { processed: 0, updated: 0, errors: 0 }
  };

  try {
    // Auto-assign instructor tiers
    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR',
        instructorCommissions: {
          some: {}
        }
      },
      include: {
        instructorCommissions: {
          where: {
            status: 'PAID'
          }
        },
        videoSessions: {
          where: {
            status: 'COMPLETED'
          }
        }
      }
    });

    for (const instructor of instructors) {
      try {
        const completedSessions = instructor.videoSessions.length;
        const totalCommissions = instructor.instructorCommissions.length;
        
        // Calculate average rating (you'll need to implement this based on your rating system)
        const avgRating = 4.5; // Placeholder - implement actual rating calculation

        // Determine appropriate tier
        let targetTier = 'BRONZE';
        if (completedSessions >= 1000 && avgRating >= 4.9) targetTier = 'DIAMOND';
        else if (completedSessions >= 200 && avgRating >= 4.8) targetTier = 'PLATINUM';
        else if (completedSessions >= 50 && avgRating >= 4.5) targetTier = 'GOLD';
        else if (completedSessions >= 10) targetTier = 'SILVER';

        // Get current tier
        const currentAssignment = await prisma.instructorCommissionTierAssignment.findFirst({
          where: {
            instructorId: instructor.id,
            endDate: null
          },
          include: { tier: true }
        });

        if (!currentAssignment || currentAssignment.tier.tierName !== targetTier) {
          // Assign new tier
          const tier = await prisma.instructorCommissionTier.findFirst({
            where: { tierName: targetTier, isActive: true }
          });

          if (tier) {
            // End current assignment
            if (currentAssignment) {
              await prisma.instructorCommissionTierAssignment.update({
                where: { id: currentAssignment.id },
                data: { endDate: new Date() }
              });
            }

            // Create new assignment
            await prisma.instructorCommissionTierAssignment.create({
              data: {
                instructorId: instructor.id,
                tierId: tier.id,
                startDate: new Date(),
                assignedBy: 'system',
                metadata: {
                  assignedBy: 'system',
                  assignedAt: new Date().toISOString(),
                  reason: 'Auto-assignment based on performance',
                  completedSessions,
                  totalCommissions,
                  avgRating
                }
              }
            });

            results.instructors.updated++;
          }
        }

        results.instructors.processed++;

      } catch (error) {
        console.error(`Error processing instructor ${instructor.id}:`, error);
        results.instructors.errors++;
      }
    }

    // Auto-assign host tiers
    const hosts = await prisma.user.findMany({
      where: {
        liveConversationsHosted: {
          some: {}
        }
      },
      include: {
        hostCommissions: {
          where: {
            status: 'PAID'
          }
        },
        liveConversationsHosted: {
          where: {
            status: 'COMPLETED'
          }
        }
      }
    });

    for (const host of hosts) {
      try {
        const completedConversations = host.liveConversationsHosted.length;
        const totalCommissions = host.hostCommissions.length;
        
        // Calculate average rating (placeholder)
        const avgRating = 4.5;

        // Determine appropriate tier
        let targetTier = 'COMMUNITY';
        if (completedConversations >= 500 && avgRating >= 4.9) targetTier = 'MASTER';
        else if (completedConversations >= 100 && avgRating >= 4.8) targetTier = 'PROFESSIONAL';
        else if (completedConversations >= 20 && avgRating >= 4.5) targetTier = 'EXPERIENCED';
        else if (completedConversations >= 5) targetTier = 'ACTIVE';

        // Get current tier
        const currentAssignment = await prisma.hostCommissionTierAssignment.findFirst({
          where: {
            hostId: host.id,
            endDate: null
          },
          include: { tier: true }
        });

        if (!currentAssignment || currentAssignment.tier.tierName !== targetTier) {
          // Assign new tier
          const tier = await prisma.hostCommissionTier.findFirst({
            where: { tierName: targetTier, isActive: true }
          });

          if (tier) {
            // End current assignment
            if (currentAssignment) {
              await prisma.hostCommissionTierAssignment.update({
                where: { id: currentAssignment.id },
                data: { endDate: new Date() }
              });
            }

            // Create new assignment
            await prisma.hostCommissionTierAssignment.create({
              data: {
                hostId: host.id,
                tierId: tier.id,
                startDate: new Date(),
                assignedBy: 'system',
                metadata: {
                  assignedBy: 'system',
                  assignedAt: new Date().toISOString(),
                  reason: 'Auto-assignment based on performance',
                  completedConversations,
                  totalCommissions,
                  avgRating
                }
              }
            });

            results.hosts.updated++;
          }
        }

        results.hosts.processed++;

      } catch (error) {
        console.error(`Error processing host ${host.id}:`, error);
        results.hosts.errors++;
      }
    }

  } catch (error) {
    console.error('Error in auto-assignment:', error);
    throw error;
  }

  return results;
}
