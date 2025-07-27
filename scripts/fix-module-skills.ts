import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  // 1. Remove orphaned module_skills
  const modules = await prisma.modules.findMany({ select: { id: true } });
  const validModuleIds = new Set(modules.map(m => m.id));
  const allModuleSkills = await prisma.module_skills.findMany();
  let orphanCount = 0;
  for (const skill of allModuleSkills) {
    if (!validModuleIds.has(skill.module_id)) {
      await prisma.module_skills.delete({
        where: { module_id_skill: { module_id: skill.module_id, skill: skill.skill } }
      });
      orphanCount++;
      console.log(`Deleted orphaned skill: ${skill.module_id} - ${skill.skill}`);
    }
  }
  console.log(`Deleted ${orphanCount} orphaned module_skills.`);

  // 2. Ensure every module has at least one skill (default 'Listening')
  let addedCount = 0;
  for (const m of modules) {
    const skills = await prisma.module_skills.findMany({ where: { module_id: m.id } });
    if (skills.length === 0) {
      await prisma.module_skills.create({ data: { module_id: m.id, skill: 'Listening' } });
      addedCount++;
      console.log(`Added 'Listening' to module ${m.id}`);
    }
  }
  console.log(`Added 'Listening' to ${addedCount} modules with no skills.`);

  await prisma.$disconnect();
}

main().catch(e => { logger.error('An error occurred'); process.exit(1); }); 