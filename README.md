# ⚰️ Subscription Graveyard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://zillerdx.github.io/Subscription-Graveyard/)
[![GitHub Actions](https://img.shields.io/badge/Deployment-GitHub%20Pages%20Actions-blue?style=for-the-badge&logo=githubactions)](https://github.com/ZillerDX/Subscription-Graveyard/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> 👉 **Live Application**: [https://zillerdx.github.io/Subscription-Graveyard/](https://zillerdx.github.io/Subscription-Graveyard/)  
> *(เปิดทดลองใช้งานได้ทันที มี **Interactive Demo Mode** ให้ทดลองเล่นฟีเจอร์ทั้งหมดได้ทันทีโดยไม่ต้องติดตั้งหรือผูกบัตรเครดิต)*

A minimal, telemetry-driven subscription optimization web application. Calculate true cost per engagement hour, identify wasteful zombie subscriptions, and evaluate value across **Zone คุ้มค่า (Worth It)** vs **Zone ไม่คุ้มค่า (Waste Zone)**.

---

## 📌 Overview & Key Features

- ⏱️ **Daily Usage Engine (ชั่วโมงต่อวัน)**: ระบุเวลาใช้งานเฉลี่ยต่อวัน (ชม./วัน หรือ นาที/วัน) ระบบคำนวณแปลงเป็นรายเดือน ($\times 30.4$) และรายปี ($\times 365$) พร้อมแสดงต้นทุนเฉลี่ยต่อชั่วโมง ($/hr) แบบ Real-time
- 📊 **Binary Value Matrix (Zone คุ้มค่า vs Zone ไม่คุ้มค่า)**: แยกแยะบริการออกเป็น 2 โซนชัดเจน
  - 🟢 **Zone คุ้มค่า (Worth It Zone)**: บริการที่ใช้งานสม่ำเสมอ หรือต้นทุนต่อชั่วโมงต่ำ คุ้มค่าสมควรต่ออายุ
  - 🔴 **Zone ไม่คุ้มค่า (Waste Zone)**: บริการที่จ่ายเงินทิ้งแต่แทบไม่เปิดใช้ พร้อมปุ่มด่วน **"ส่งไป Graveyard"** เพื่อหยุดรายจ่ายรั่วไหลทันที
- 🎯 **Personalized Value Assessment**: ปรับเกณฑ์ความคุ้มค่าเฉพาะบุคคล อิงตามหลักการเงิน **50/30/20** และเกณฑ์ **Cost-per-engagement hour** ของสื่อบันเทิงและซอฟต์แวร์
- 🏷️ **Real Brand Vector Logos**: โลโก้เวกเตอร์แท้ของบริการยอดนิยม (YouTube, Netflix, Spotify, ChatGPT, Adobe, etc.) พร้อมพรีเซ็ตกรอกข้อมูลอัตโนมัติ
- 🌐 **Dual-Language System**: สลับภาษา **ไทย (TH 🇹🇭) / English (EN 🇺🇸)** ได้ทุกหน้าแบบไม่เพี้ยน
- 📥 **Export to CSV**: ส่งออกรายการค่าใช้จ่ายและเวลาใช้งานเป็นไฟล์ CSV ได้ทันที

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS, Recharts, TanStack Query v5, React Icons (`fi` + `si`), React Hot Toast |
| **Backend (Optional API)** | FastAPI (Python 3.11+), PostgreSQL, SQLAlchemy 2.0, Alembic, Pydantic v2, Pytest |
| **Storage & Auth** | Client-Side Multi-User Engine (`localStorage`) for GitHub Pages + REST API for fullstack mode |
| **Deployment** | GitHub Pages via GitHub Actions CI/CD |

---

## 📂 Annotated Folder Tree

```text
Subscription-Graveyard/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD pipeline for GitHub Pages
├── backend/                    # Optional FastAPI REST backend
│   ├── alembic/                # Database migration scripts
│   ├── app/
│   │   ├── api/v1/endpoints/   # Auth, subscriptions, and dashboard endpoints
│   │   ├── core/               # App config, database session, JWT security
│   │   ├── models/             # SQLAlchemy ORM models (User, Subscription)
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── services/           # Backend calculation & query services
│   ├── requirements.txt        # Python backend dependencies
│   └── Dockerfile              # Container spec for backend service
├── frontend/                   # React + TypeScript single-page application
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # BrandLogo, ConfirmDialog, ProtectedRoute
│   │   │   ├── dashboard/      # KillZoneChart (2-Zone Matrix), StatsCards, CategoryBreakdown
│   │   │   └── subscriptions/  # SubscriptionCard, SubscriptionForm, SubscriptionList
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Session state & demo mode handler
│   │   │   └── LanguageContext.tsx # TH/EN translation dictionary & switcher
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx   # Value Matrix overview & insights
│   │   │   ├── SubscriptionsPage.tsx # List, filter, search, & CSV export
│   │   │   ├── AssessmentPage.tsx  # Category priority survey & benchmarks
│   │   │   ├── LoginPage.tsx       # Sign in & instant demo launcher
│   │   │   └── RegisterPage.tsx    # User registration
│   │   ├── services/           # Storage engine & API services
│   │   ├── types/              # TypeScript interfaces for subscriptions & users
│   │   └── utils/
│   │       ├── calculations.ts # Daily-to-monthly/yearly conversions & Zone thresholds
│   │       └── csvExport.ts    # CSV data exporter
│   ├── package.json            # Node.js dependencies & scripts
│   ├── tailwind.config.js      # Custom minimal Toggl color palette
│   └── vite.config.ts          # Vite configuration with base path for GitHub Pages
├── docker-compose.yml          # Local PostgreSQL database setup
└── README.md                   # Project documentation
```

---

## ⚡ Commands & Quickstart

### 🖥️ Frontend (Quickest way to run)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# 👉 Local preview: http://localhost:5173

# 4. Run type check & build production bundle
npm run build

# 5. Run tests
npm test
```

### 🐳 Backend & Database (Optional fullstack mode)

```bash
# 1. Start PostgreSQL via Docker
docker-compose up -d postgres

# 2. Setup Python environment
cd backend
python -m venv venv

# Activate venv:
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 3. Install requirements & run migrations
pip install -r requirements.txt
alembic upgrade head

# 4. Start FastAPI server
uvicorn app.main:app --reload
# 👉 API documentation: http://localhost:8000/docs
```

---

## 📄 License

Distributed under the **MIT License**. Created by [@ZillerDX](https://github.com/ZillerDX).
