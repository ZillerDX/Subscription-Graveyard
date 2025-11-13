# 💸 Subscription Graveyard

A modern web application to track, analyze, and manage your recurring subscriptions. Kill the zombie subscriptions that drain your wallet!

## 📖 About

Subscription Graveyard helps you take control of your recurring expenses by providing:

- **Dashboard Analytics** - Visualize your monthly burn rate and spending patterns
- **Kill Zone Chart** - Identify high-cost, low-value subscriptions that should be cancelled
- **Smart Management** - Track, rate, and manage all your subscriptions in one place
- **Savings Insights** - See how much you can save by cancelling unnecessary subscriptions

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (data visualization)
- React Query

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL
- SQLAlchemy 2.0
- Alembic (migrations)
- JWT authentication

## 📋 Prerequisites

Before running this project, make sure you have:

- **Python 3.11+** installed
- **Node.js 18+** and npm installed
- **Docker Desktop** installed and running
- **Git** installed

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ZillerDX/Subscription-Graveyard.git
cd Subscription-Graveyard
```

### 2. Start the Database

Make sure Docker Desktop is running, then:

```bash
docker-compose up -d postgres
```

This will start a PostgreSQL database on port 5432.

### 3. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy ..\.env.backend.example .env
# On Mac/Linux: cp ../.env.backend.example .env

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

Backend will be running at: **http://localhost:8000**

API documentation: **http://localhost:8000/docs**

### 4. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy ..\.env.frontend.example .env
# On Mac/Linux: cp ../.env.frontend.example .env

# Start the development server
npm run dev
```

Frontend will be running at: **http://localhost:5173**

## 💻 How to Use

### First Time Setup

1. **Open the app** at http://localhost:5173
2. **Create an account** using the Register page
3. **Login** with your credentials

### Adding Subscriptions

1. Click **"Add New Subscription"** button
2. Choose from popular platforms or create custom subscription
3. Enter the cost and billing cycle
4. **Rate the value** using the star system (1-5 stars)
5. Select a category
6. Click **"Add Subscription"**

### Managing Subscriptions

**View Dashboard:**
- See your total monthly burn rate
- View yearly cost projection
- Check the Kill Zone chart to identify subscriptions to cancel
- See spending by category

**Manage Subscriptions:**
- Navigate to "My Subscriptions" page
- **Edit** subscriptions to update details or value ratings
- **Cancel** subscriptions you want to stop
- **Reactivate** cancelled subscriptions if needed
- **Delete Forever** to permanently remove cancelled subscriptions

### Understanding the Kill Zone Chart

The chart plots your subscriptions based on:
- **X-axis**: Monthly cost
- **Y-axis**: Value score (1-5 stars)

**Color Zones:**
- 🔴 **Red (Kill Zone)**: High cost + Low value → Cancel these!
- 🟠 **Orange**: High cost + High value → Expensive but worth it
- 🟡 **Yellow**: Low cost + Low value → Consider if needed
- 🟢 **Green**: Low cost + High value → Best subscriptions!

## 📱 Features

- ✅ User authentication (register/login/logout)
- ✅ Add, edit, cancel, and reactivate subscriptions
- ✅ Interactive dashboard with analytics
- ✅ Kill Zone visualization
- ✅ Category breakdown
- ✅ Value rating system with stars
- ✅ Monthly and yearly cost calculations
- ✅ Identify kill candidates (low-value subscriptions)
- ✅ Track potential savings

## 🛠️ Development

### Running Tests

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Project Structure

```
Subscription-Graveyard/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Config, security, database
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── alembic/            # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── context/        # React context
│   └── package.json
└── docker-compose.yml      # Database setup
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Subscriptions
- `GET /api/v1/subscriptions` - List all subscriptions
- `POST /api/v1/subscriptions` - Create subscription
- `PUT /api/v1/subscriptions/:id` - Update subscription
- `PATCH /api/v1/subscriptions/:id/cancel` - Cancel subscription
- `PATCH /api/v1/subscriptions/:id/reactivate` - Reactivate subscription
- `DELETE /api/v1/subscriptions/:id` - Delete subscription

### Dashboard
- `GET /api/v1/dashboard/stats` - Get statistics
- `GET /api/v1/dashboard/kill-zone` - Get Kill Zone data
- `GET /api/v1/dashboard/category-breakdown` - Get spending by category

Full API documentation available at: http://localhost:8000/docs

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT-based authentication
- User data is isolated and private
- CORS protection enabled
- SQL injection prevention via SQLAlchemy ORM

## 📝 Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://subgraveyard:dev_password_123@localhost:5432/subscription_graveyard_dev
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:8000
```

## 🤝 Contributing

This is a personal project. Feel free to fork and modify for your own use.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**ZillerDX**
- GitHub: [@ZillerDX](https://github.com/ZillerDX)

---

**Built to help you kill your zombie subscriptions and save money!** 💰
