@echo off
REM Subscription Graveyard - Project Initialization Script (Windows)
REM This script sets up the complete project structure for development

echo.
echo ============================================
echo    Subscription Graveyard - Project Setup
echo ============================================
echo.

REM Check prerequisites
echo Checking prerequisites...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is required but not installed. Aborting.
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is required but not installed. Aborting.
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is required but not installed. Aborting.
    exit /b 1
)

echo [OK] All prerequisites found
echo.

REM Create project structure
echo Creating project structure...

REM Backend structure
mkdir backend\app\core 2>nul
mkdir backend\app\models 2>nul
mkdir backend\app\schemas 2>nul
mkdir backend\app\api\v1\endpoints 2>nul
mkdir backend\app\services 2>nul
mkdir backend\app\tests 2>nul
mkdir backend\alembic\versions 2>nul
mkdir backend\scripts 2>nul

REM Frontend structure
mkdir frontend\src\components\common 2>nul
mkdir frontend\src\components\subscriptions 2>nul
mkdir frontend\src\components\dashboard 2>nul
mkdir frontend\src\pages 2>nul
mkdir frontend\src\services 2>nul
mkdir frontend\src\hooks 2>nul
mkdir frontend\src\context 2>nul
mkdir frontend\src\utils 2>nul
mkdir frontend\src\types 2>nul
mkdir frontend\public 2>nul

REM Documentation
mkdir docs 2>nul

echo [OK] Project structure created
echo.

REM Initialize Backend
echo Setting up backend...
cd backend

REM Create Python virtual environment
echo [INFO] Creating Python virtual environment...
python -m venv venv
echo [OK] Virtual environment created

REM Activate virtual environment
call venv\Scripts\activate

REM Create requirements.txt if it doesn't exist
if not exist requirements.txt (
    (
        echo fastapi==0.104.1
        echo uvicorn[standard]==0.24.0
        echo sqlalchemy==2.0.23
        echo psycopg2-binary==2.9.9
        echo alembic==1.12.1
        echo pydantic==2.5.0
        echo pydantic-settings==2.1.0
        echo python-jose[cryptography]==3.3.0
        echo passlib[bcrypt]==1.7.4
        echo python-multipart==0.0.6
        echo pytest==7.4.3
        echo pytest-asyncio==0.21.1
        echo httpx==0.25.2
        echo black==23.12.0
        echo flake8==6.1.0
        echo isort==5.13.2
    ) > requirements.txt
    echo [OK] requirements.txt created
)

REM Install dependencies
echo [INFO] Installing Python dependencies ^(this may take a few minutes^)...
pip install -q -r requirements.txt
echo [OK] Python dependencies installed

REM Copy environment file
if not exist .env (
    copy ..\.env.backend.example .env >nul
    echo [OK] .env file created ^(please update with your values^)
) else (
    echo [WARNING] .env file already exists, skipping
)

REM Create main.py
(
    echo from fastapi import FastAPI
    echo from fastapi.middleware.cors import CORSMiddleware
    echo.
    echo app = FastAPI^(
    echo     title="Subscription Graveyard API",
    echo     description="Track and kill your zombie subscriptions",
    echo     version="1.0.0",
    echo     docs_url="/docs",
    echo     redoc_url="/redoc"
    echo ^)
    echo.
    echo # CORS configuration
    echo app.add_middleware^(
    echo     CORSMiddleware,
    echo     allow_origins=["http://localhost:5173", "http://localhost:3000"],
    echo     allow_credentials=True,
    echo     allow_methods=["*"],
    echo     allow_headers=["*"],
    echo ^)
    echo.
    echo @app.get^("/health"^)
    echo async def health_check^(^):
    echo     """Health check endpoint"""
    echo     return {"status": "healthy", "message": "Subscription Graveyard API is running"}
    echo.
    echo @app.get^("/"^)
    echo async def root^(^):
    echo     """Root endpoint"""
    echo     return {
    echo         "message": "Welcome to Subscription Graveyard API",
    echo         "docs": "/docs",
    echo         "version": "1.0.0"
    echo     }
) > app\main.py
echo [OK] main.py created

REM Create __init__.py files
type nul > app\__init__.py
type nul > app\core\__init__.py
type nul > app\models\__init__.py
type nul > app\schemas\__init__.py
type nul > app\api\__init__.py
type nul > app\api\v1\__init__.py
type nul > app\api\v1\endpoints\__init__.py
type nul > app\services\__init__.py
type nul > app\tests\__init__.py
echo [OK] Python package files created

REM Create pytest configuration
(
    echo [pytest]
    echo testpaths = tests
    echo python_files = test_*.py
    echo python_classes = Test*
    echo python_functions = test_*
    echo addopts = -v --tb=short
) > pytest.ini
echo [OK] pytest.ini created

cd ..
echo.

REM Initialize Frontend
echo Setting up frontend...
cd frontend

REM Check if package.json exists
if not exist package.json (
    echo [INFO] Please initialize Vite project manually with:
    echo npm create vite@latest . -- --template react-ts
    pause
)

REM Install dependencies
echo [INFO] Installing frontend dependencies ^(this may take a few minutes^)...
call npm install
call npm install react-router-dom recharts axios @tanstack/react-query
call npm install -D tailwindcss postcss autoprefixer
echo [OK] Frontend dependencies installed

REM Initialize Tailwind CSS
if not exist tailwind.config.js (
    call npx tailwindcss init -p
    echo [OK] Tailwind CSS initialized
)

REM Copy environment file
if not exist .env (
    copy ..\.env.frontend.example .env >nul
    echo [OK] .env file created ^(please update with your values^)
) else (
    echo [WARNING] .env file already exists, skipping
)

cd ..
echo.

REM Initialize Git repository
if not exist .git (
    echo Initializing Git repository...
    git init

    REM Create .gitignore
    (
        echo # Python
        echo __pycache__/
        echo *.py[cod]
        echo *$py.class
        echo *.so
        echo .Python
        echo venv/
        echo env/
        echo ENV/
        echo *.egg-info/
        echo .pytest_cache/
        echo .coverage
        echo htmlcov/
        echo.
        echo # Node
        echo node_modules/
        echo dist/
        echo build/
        echo *.log
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Environment files
        echo .env
        echo .env.local
        echo .env.*.local
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo *~
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Database
        echo *.db
        echo *.sqlite
        echo *.sqlite3
    ) > .gitignore

    git add .
    git commit -m "chore: initial project setup"
    echo [OK] Git repository initialized
) else (
    echo [WARNING] Git repository already exists, skipping
)

echo.
echo ============================================
echo    Project setup complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Start the database:
echo    docker-compose up -d postgres
echo.
echo 2. Start the backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload
echo    Backend will run at: http://localhost:8000
echo.
echo 3. Start the frontend ^(in a new terminal^):
echo    cd frontend
echo    npm run dev
echo    Frontend will run at: http://localhost:5173
echo.
echo 4. Access API documentation:
echo    http://localhost:8000/docs
echo.
echo Read CONTRIBUTING.md for development guidelines
echo Follow dev-phase.md for phase-by-phase development
echo.
echo Happy coding!
echo.
pause
