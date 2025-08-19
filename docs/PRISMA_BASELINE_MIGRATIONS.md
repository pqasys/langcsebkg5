## Prisma Baseline Migrations from Current Live Database (No Reset)

This guide documents how we established a clean migrations history starting from the current live database state, without resetting or altering existing data.

### What we did
- Created a single baseline migration that represents the live schema at the time of creation:
  - `prisma/migrations/20250819012608_baseline/migration.sql`
- Moved older migration folders to a backup so the repo only tracks the baseline moving forward:
  - Backup: `prisma/migrations_backup_20250819012608_baseline/`
- Left the live database untouched. We did not modify or reset data, and we did not rewrite the `_prisma_migrations` table.

### Why `migrate resolve --applied` failed (and is not required)
- The database already contains previous migration history. Marking the new baseline as "applied" failed with `P3017` because the DB's `_prisma_migrations` entries do not match the local baseline-only folder.
- We intentionally avoided altering the DB migration history to prevent risk. This is safe for production as long as we use `db push` on this DB, and use the baseline for new environments.

### Recommended workflows

#### For this live/production database (no reset)
- Apply schema changes safely without running migrations:
```powershell
npx prisma db push
npx prisma generate
```
- This keeps the DB in sync with `prisma/schema.prisma` and avoids the historical failing migration.

#### For fresh environments (new databases)
- Use the baseline as the starting point:
```powershell
npx prisma migrate deploy
```
- This applies `20250819012608_baseline` (and any new migrations you add later) to create the schema from scratch.

### Creating future migrations
- For production/live DB: continue using `db push` + `generate` for changes.
- For new environments: create new migrations normally on a dev DB, or generate SQL migrations via `migrate diff`.

Examples:
- Normal dev flow on a clean dev DB (preferred for future changes):
```powershell
npx prisma migrate dev --name descriptive_change
npx prisma generate
```
- Generate a SQL migration without using a dev shadow DB (advanced):
```powershell
$ts = Get-Date -Format 'yyyyMMddHHmmss'
$name = "$ts`_descriptive_change"
New-Item -ItemType Directory -Force "prisma\migrations\$name" | Out-Null
npx prisma migrate diff --from-schema-datamodel prisma\schema.prisma --to-schema-datamodel prisma\schema.prisma --script > "prisma\migrations\$name\migration.sql"
```
Note: The `diff` example above requires you to supply appropriate `--from-*` and `--to-*` inputs based on your workflow. For most teams, using a throwaway dev DB with `migrate dev` is simpler and safer.

### Important notes
- We did not modify `_prisma_migrations` on the live DB. This avoids risk but means `migrate resolve --applied <baseline>` is not used.
- Do not delete the baseline folder; it is now the canonical starting point for fresh databases.
- If you ever want to fully reconcile the DB migration history to the baseline, plan downtime and take backups; that process involves carefully editing `_prisma_migrations` and is not recommended unless strictly necessary.

### Quick reference
- Live DB (no reset): `npx prisma db push` then `npx prisma generate`
- Fresh DBs: `npx prisma migrate deploy`
- Baseline migration folder: `prisma/migrations/20250819012608_baseline/`
- Old migrations backup: `prisma/migrations_backup_20250819012608_baseline/`


