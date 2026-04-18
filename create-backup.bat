@echo off
echo Creating backup of Barber Study Pro...
echo.

set SOURCE=C:\Users\skyfl\.openclaw\workspace\barber-study-pro
set DEST=C:\Users\skyfl\.openclaw\workspace\barber-study-pro-BACKUP-2026-04-15
set LOG=C:\Users\skyfl\.openclaw\workspace\backup-log.txt

echo Source: %SOURCE%
echo Destination: %DEST%
echo.

if not exist "%DEST%" mkdir "%DEST%"

xcopy /E /I /Y "%SOURCE%\*" "%DEST%\" > "%LOG%" 2>&1

echo.
echo Backup completed!
echo Check %LOG% for details
echo.
pause
