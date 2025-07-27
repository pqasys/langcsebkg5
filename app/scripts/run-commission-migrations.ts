import { runCommissionMigrations } from '../lib/migrations/commission-setup';
import { toast } from 'sonner';

async function main() {
  try {
    console.log('Starting commission migrations...');
    await runCommissionMigrations();
    console.log('Commission migrations completed successfully');
    process.exit(0);
  } catch (error) {
    toast.error('Error running commission migrations:');
    process.exit(1);
  }
}

main(); 