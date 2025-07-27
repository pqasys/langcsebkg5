# Booking Payment Consistency Audit System

## Overview

This system provides automated auditing and fixing of inconsistencies between booking status, payment status, and enrollment paymentStatus across all records in the database.

## Problem Solved

The system addresses data inconsistencies where:
- A booking has status `PENDING` but the related payment has status `COMPLETED`
- An enrollment has `paymentStatus: 'PENDING'` but the payment has status `COMPLETED`
- Records are in payment states without corresponding payment records

## Components

### 1. Audit Script
**File:** `scripts/audit-fix-booking-payment-consistency.ts`

**Functionality:**
- Scans all bookings in the database
- For each booking, finds the related enrollment and latest payment
- Fixes inconsistencies by updating:
  - Booking status to match payment status
  - Enrollment paymentStatus to match payment status
- Resets records to `PENDING` if no payment exists but they're in payment states
- Provides detailed logging of all changes

### 2. Admin Interface
**Location:** `/admin/settings/common-scripts`

**Features:**
- One-click execution of the audit script
- Real-time results display
- Detailed logs with expandable sections
- Visual indicators for fixed inconsistencies and errors

### 3. API Endpoint
**Route:** `/api/admin/scripts/booking-payment-consistency`

**Security:** Admin-only access
**Timeout:** 5 minutes
**Returns:** Detailed results with statistics

## Usage

### Via Admin Interface
1. Navigate to `/admin/settings/common-scripts`
2. Click "Run Consistency Audit" button
3. Wait for the script to complete
4. Review results and detailed logs

### Via Command Line
```bash
npx tsx scripts/audit-fix-booking-payment-consistency.ts
```

### Via Windows Task Scheduler
1. Use the provided `run-audit-fix.bat` file
2. Set up a scheduled task in Windows Task Scheduler
3. Configure the task to run at your desired frequency

## Scheduling Setup (Windows)

### Step 1: Create the Batch File
The `run-audit-fix.bat` file is already created in the project root.

### Step 2: Set Up Windows Task Scheduler
1. Press `Win + R`, type `taskschd.msc`, press Enter
2. Click "Create Task..."
3. **General Tab:**
   - Name: "Booking Payment Consistency Audit"
   - Description: "Runs booking payment consistency audit script"
   - Run whether user is logged on or not: ✓
   - Run with highest privileges: ✓

4. **Triggers Tab:**
   - Click "New..."
   - Choose your schedule (e.g., Daily at 2:00 AM)
   - Click OK

5. **Actions Tab:**
   - Click "New..."
   - Action: Start a program
   - Program/script: `C:\wamp64\www\myCursorProj\langcsebkg3\run-audit-fix.bat`
   - Start in: `C:\wamp64\www\myCursorProj\langcsebkg3`
   - Click OK

6. **Conditions Tab:**
   - Uncheck "Start the task only if the computer is on AC power"
   - Check "Wake the computer to run this task"

7. **Settings Tab:**
   - Allow task to be run on demand: ✓
   - Run task as soon as possible after a scheduled start is missed: ✓
   - If the task fails, restart every: 1 hour, up to 3 restarts

8. Click OK to save the task

### Step 3: Test the Task
1. Right-click your new task
2. Select "Run"
3. Check the task history to ensure it completed successfully

## Status Mapping

The script maps payment statuses to booking/enrollment statuses as follows:

| Payment Status | Booking Status | Enrollment PaymentStatus |
|----------------|----------------|-------------------------|
| `COMPLETED` | `COMPLETED` | `PAID` |
| `PAID` | `COMPLETED` | `PAID` |
| `FAILED` | `FAILED` | `FAILED` |
| `PENDING` | `PAYMENT_INITIATED` | `PENDING` |
| No Payment | `PENDING` | `PENDING` |

## Monitoring

### Check Task History
1. Open Task Scheduler
2. Find your task
3. Click "History" tab to see execution logs

### Review Script Output
The script provides detailed output including:
- Total bookings checked
- Number of inconsistencies fixed
- Number of errors encountered
- Detailed log of all changes

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure the task runs with highest privileges
   - Check that the batch file path is correct

2. **Script Not Found**
   - Verify the project path in the batch file
   - Ensure `npx` and `tsx` are available

3. **Database Connection Issues**
   - Check that the database is accessible
   - Verify environment variables are set correctly

### Logs
- Task Scheduler logs: Check the History tab in Task Scheduler
- Script logs: Review the detailed output in the admin interface
- Database logs: Check your database logs for any connection issues

## Security Considerations

- The script only runs with admin privileges
- All database operations are logged
- The script is read-only for data it doesn't need to fix
- No sensitive data is exposed in logs

## Performance

- The script processes bookings in batches
- Typical execution time: 1-5 minutes depending on database size
- Memory usage is minimal
- Database impact is low as it only updates inconsistent records

## Maintenance

### Regular Tasks
- Monitor task execution in Windows Task Scheduler
- Review audit results in the admin interface
- Check for any recurring inconsistencies that might indicate system issues

### Updates
- Keep the script updated with any schema changes
- Test the script after database migrations
- Update the batch file path if the project location changes 