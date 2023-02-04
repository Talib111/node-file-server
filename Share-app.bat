@echo off
Title Get IP and MAC Address
@for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do (
    set "MY_IP=%%a"
)

echo GO TO THIS IP : %MY_IP%
@REM cd C:\NODE\node-file-server
cd .
node server.js
pause