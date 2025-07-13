@echo off
echo Installing Node.js dependencies...
call npm install

echo.
echo Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update it with your database credentials.
) else (
    echo .env file already exists.
)

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Update .env file with your MySQL database credentials
echo 2. Create your MySQL database
echo 3. Run: npm run db:setup (to create tables and seed data)
echo 4. Run: npm run dev (to start the development server)
echo.
pause
