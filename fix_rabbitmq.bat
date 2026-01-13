@echo off
:: Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

echo ==========================================
echo Resetting RabbitMQ Service...
echo ==========================================

cd /d "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.13.7\sbin"

echo [1/4] Stopping Service...
call rabbitmq-service.bat stop

echo [2/4] Removing Service...
call rabbitmq-service.bat remove

echo [3/4] Re-installing Service...
call rabbitmq-service.bat install

echo [4/4] Starting Service...
call rabbitmq-service.bat start

echo.
echo [5/5] Enabling Management Plugin (just in case)...
call rabbitmq-plugins.bat enable rabbitmq_management

echo.
echo ==========================================
echo RabbitMQ Reset Complete.
echo Please restart your backend server now.
echo ==========================================
pause
