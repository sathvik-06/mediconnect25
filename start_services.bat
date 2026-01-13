@echo off
:: Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

:: If error flag set, we do not have admin.
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
echo Enabling and Starting Backend Services...
echo ==========================================

echo.
echo [1/3] Configuring MongoDB...
sc config MongoDB start= auto
if %errorlevel% NEQ 0 (
   echo Warning: Could not configure MongoDB. Retrying with 'MongoDB Server'...
   sc config "MongoDB Server" start= auto
)
net start MongoDB
if %errorlevel% NEQ 0 ( net start "MongoDB Server" )

echo.
echo [2/3] Configuring Redis...
sc config Redis start= auto
net start Redis

echo.
echo [3/3] Configuring RabbitMQ...
sc config RabbitMQ start= auto
net start RabbitMQ

echo.
echo ==========================================
echo Operations complete.
echo Please check for "SUCCESS" or "The service is already running" messages above.
echo You can now restart your backend server.
echo ==========================================
pause
