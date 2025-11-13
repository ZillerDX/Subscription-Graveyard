#!/bin/bash

# Subscription Graveyard - Project Initialization Script
# This script sets up the complete project structure for development

set -e  # Exit on error

echo "🚀 Subscription Graveyard - Project Setup"
echo "========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
echo "Checking prerequisites..."
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
print_success "All prerequisites found"
echo ""

# Create project structure
echo "Creating project structure..."

# Backend structure
mkdir -p backend/app/{core,models,schemas,api/v1/endpoints,services,tests}
mkdir -p backend/alembic/versions
mkdir -p backend/scripts

# Frontend structure
mkdir -p frontend/src/{components/{common,subscriptions,dashboard},pages,services,hooks,context,utils,types}
mkdir -p frontend/public

# Documentation
mkdir -p docs

print_success "Project structure created"
echo ""

# Initialize Backend
echo "Setting up backend..."
cd backend

# Create Python virtual environment
print_info "Creating Python virtual environment..."
python3 -m venv venv
print_success "Virtual environment created"

# Activate virtual environment
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

# Create requirements.txt if it doesn't exist
if [ ! -f requirements.txt ]; then
    cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
black==23.12.0
flake8==6.1.0
isort==5.13.2
EOF
    print_success "requirements.txt created"
fi

# Install dependencies
print_info "Installing Python dependencies (this may take a few minutes)..."
pip install -q -r requirements.txt
print_success "Python dependencies installed"

# Copy environment file
if [ ! -f .env ]; then
    cp ../.env.backend.example .env
    print_success ".env file created (please update with your values)"
else
    print_warning ".env file already exists, skipping"
fi

# Create main.py
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Subscription Graveyard API",
    description="Track and kill your zombie subscriptions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Subscription Graveyard API is running"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Subscription Graveyard API",
        "docs": "/docs",
        "version": "1.0.0"
    }
EOF
print_success "main.py created"

# Create __init__.py files
touch app/__init__.py
touch app/core/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/api/v1/endpoints/__init__.py
touch app/services/__init__.py
touch app/tests/__init__.py
print_success "Python package files created"

# Create pytest configuration
cat > pytest.ini << 'EOF'
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
EOF
print_success "pytest.ini created"

cd ..
echo ""

# Initialize Frontend
echo "Setting up frontend..."
cd frontend

# Check if package.json exists
if [ ! -f package.json ]; then
    print_info "Initializing Vite React TypeScript project..."
    npm create vite@latest . -- --template react-ts
    print_success "Vite project initialized"
fi

# Install dependencies
print_info "Installing frontend dependencies (this may take a few minutes)..."
npm install --silent
npm install --silent react-router-dom recharts axios @tanstack/react-query
npm install --silent -D tailwindcss postcss autoprefixer
print_success "Frontend dependencies installed"

# Initialize Tailwind CSS
if [ ! -f tailwind.config.js ]; then
    npx tailwindcss init -p
    print_success "Tailwind CSS initialized"
fi

# Copy environment file
if [ ! -f .env ]; then
    cp ../.env.frontend.example .env
    print_success ".env file created (please update with your values)"
else
    print_warning ".env file already exists, skipping"
fi

cd ..
echo ""

# Initialize Git repository
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init

    # Create .gitignore
    cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
*.egg-info/
.pytest_cache/
.coverage
htmlcov/

# Node
node_modules/
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite
*.sqlite3

# Alembic
alembic/versions/*.py
!alembic/versions/__init__.py
EOF

    git add .
    git commit -m "chore: initial project setup"
    print_success "Git repository initialized"
else
    print_warning "Git repository already exists, skipping"
fi

echo ""
echo "========================================="
echo "✨ Project setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the database:"
echo "   ${BLUE}docker-compose up -d postgres${NC}"
echo ""
echo "2. Start the backend:"
echo "   ${BLUE}cd backend${NC}"
echo "   ${BLUE}source venv/bin/activate${NC}  # On Windows: venv\\Scripts\\activate"
echo "   ${BLUE}uvicorn app.main:app --reload${NC}"
echo "   Backend will run at: http://localhost:8000"
echo ""
echo "3. Start the frontend (in a new terminal):"
echo "   ${BLUE}cd frontend${NC}"
echo "   ${BLUE}npm run dev${NC}"
echo "   Frontend will run at: http://localhost:5173"
echo ""
echo "4. Access API documentation:"
echo "   http://localhost:8000/docs"
echo ""
echo "📚 Read CONTRIBUTING.md for development guidelines"
echo "📝 Follow dev-phase.md for phase-by-phase development"
echo ""
echo "Happy coding! 🚀"
