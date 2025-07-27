@echo off
cd /d "C:\wamp64\www\myCursorProj\langcsebkg3"
echo Starting booking payment consistency audit...
echo Timestamp: %date% %time%
npx tsx scripts/audit-fix-booking-payment-consistency.ts
echo Audit completed at: %date% %time%
pause 