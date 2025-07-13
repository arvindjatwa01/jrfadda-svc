@echo off
echo Installing Swagger documentation dependencies...
call npm install swagger-jsdoc swagger-ui-express
echo.
echo Swagger dependencies installed successfully!
echo.
echo After starting the server, you can access:
echo - API Documentation: http://localhost:3000/api-docs
echo - API Base URL: http://localhost:3000/api/v1
echo.
pause
