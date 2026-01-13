@echo off
cd /d "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.13.7\sbin"
call rabbitmqctl.bat status
exit /b %errorlevel%
