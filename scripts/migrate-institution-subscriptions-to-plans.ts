import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sensible defaults for new plans
const DEFAULTS = {
  price: 399,
  currency: 'USD',
  features: [
    'Default feature 1',
    'Default feature 2',
    'Default feature 3'
  ],
  maxStudents: 100,
  maxCourses: 10,
  maxTeachers: 2,
  description: 'Auto-created plan based on existing institution subscriptions.'
};

async function migrateInstitutionSubscriptions() {
  console.log('🔄 Migrating InstitutionSubscription records to link to SubscriptionPlan...');

  // Fetch all plans
  const plans = await prisma.subscriptionPlan.findMany();

  // Fetch all institution subscriptions
  const subscriptions = await prisma.institutionSubscription.findMany();
  let updated = 0;
  let missing = 0;
  let created = 0;

  // Find all unique (planType, billingCycle) pairs in subscriptions
  const uniquePairs = Array.from(
    new Set(subscriptions.map(sub => `${sub.planType}|||${sub.billingCycle}`))
  ).map(pair => {
    const [planType, billingCycle] = pair.split('|||');
    return { planType, billingCycle };
  });

  // For each unique pair, ensure a SubscriptionPlan exists
  for (const { planType, billingCycle } of uniquePairs) {
    let plan = plans.find(
      p => p.name.toUpperCase() === planType.toUpperCase() && p.billingCycle.toUpperCase() === billingCycle.toUpperCase()
    );
    if (!plan) {
      // Create the missing plan
      plan = await prisma.subscriptionPlan.create({
        data: {
          name: planType,
          description: DEFAULTS.description,
          price: DEFAULTS.price,
          currency: DEFAULTS.currency,
          billingCycle,
          features: DEFAULTS.features,
          maxStudents: DEFAULTS.maxStudents,
          maxCourses: DEFAULTS.maxCourses,
          maxTeachers: DEFAULTS.maxTeachers,
          isActive: true
        }
      });
      created++;
      plans.push(plan);
      console.log(`➕ Created plan: ${planType} (${billingCycle}) [${plan.id}]`);
    }
  }

  // Now link subscriptions
  for (const sub of subscriptions) {
    const plan = plans.find(
      p => p.name.toUpperCase() === sub.planType.toUpperCase() && p.billingCycle.toUpperCase() === sub.billingCycle.toUpperCase()
    );
    if (plan) {
      if (sub.subscriptionPlanId !== plan.id) {
        await prisma.institutionSubscription.update({
          where: { id: sub.id },
          data: { subscriptionPlanId: plan.id }
        });
        updated++;
        console.log(`✔ Linked subscription ${sub.id} (${sub.planType}, ${sub.billingCycle}) to plan ${plan.name} (${plan.id})`);
      }
    } else {
      missing++;
      console.warn(`⚠️  No matching plan for subscription ${sub.id} (planType: ${sub.planType}, billingCycle: ${sub.billingCycle})`);
    }
  }

  console.log(`\n Migration complete. Created: ${created}, Updated: ${updated}, Still missing: ${missing}`);
  await prisma.$disconnect();
}

migrateInstitutionSubscriptions(); 