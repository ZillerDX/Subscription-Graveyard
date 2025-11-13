# 🚀 Deployment Guide - Subscription Graveyard

## Current Status: ✅ Almost Ready for Deployment

Your project is **95% ready** for deployment! Here's what you need to do:

---

## 📋 Deployment Architecture

Since this is a **full-stack application** (Frontend + Backend + Database), you need three components:

1. **Frontend (React)** → Vercel
2. **Backend (FastAPI)** → Railway / Render
3. **Database (PostgreSQL)** → Railway / Render / Neon

> **Note**: Vercel is optimized for frontend. While it supports serverless functions, deploying FastAPI is easier on Railway or Render.

---

## 🎯 Recommended Deployment Plan

### **Option A: All-in-One (Easiest)** ⭐ Recommended
**Platform**: Railway
- Deploy everything on Railway (Frontend + Backend + Database)
- **Pros**: Simplest setup, everything in one place, automatic HTTPS
- **Cons**: Slightly more expensive than separate services
- **Free Tier**: $5 credit/month

### **Option B: Split Deployment (Most Flexible)**
- **Frontend**: Vercel (Free)
- **Backend**: Railway/Render (Free tier available)
- **Database**: Neon/Supabase (Free tier)
- **Pros**: Better separation, can scale independently
- **Cons**: More configuration needed

---

## 🚀 STEP-BY-STEP: Deploy to Railway (Recommended)

### Prerequisites
- GitHub account (✅ You have this)
- Railway account (free): https://railway.app
- Your repository: https://github.com/ZillerDX/Subscription-Graveyard

---

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub account

---

### Step 2: Deploy Database

1. In Railway dashboard, click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Click on the database → **"Variables"** tab
5. **Copy these values** (you'll need them later):
   - `DATABASE_URL` (full connection string)

---

### Step 3: Deploy Backend

1. In Railway dashboard, click **"New"** → **"GitHub Repo"**
2. Select **"ZillerDX/Subscription-Graveyard"**
3. Railway will detect your project
4. Click **"Add variables"** and set these:

```bash
# Environment Variables for Backend
DATABASE_URL=<paste from Step 2>
JWT_SECRET_KEY=<generate with: openssl rand -hex 32>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
CORS_ORIGINS=https://<your-frontend-url>.vercel.app
ENVIRONMENT=production
DEBUG=false
```

5. Click **"Settings"** → **"Root Directory"** → Set to `backend`
6. Click **"Settings"** → **"Start Command"** → Set to:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
7. Click **"Deploy"**
8. Wait for deployment (2-3 minutes)
9. Copy your backend URL (e.g., `https://subscription-graveyard-production.up.railway.app`)

---

### Step 4: Run Database Migrations

1. In Railway dashboard, click on your **backend service**
2. Go to **"Settings"** → **"Deploy Triggers"**
3. Or connect via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run alembic upgrade head
```

---

### Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import **"ZillerDX/Subscription-Graveyard"**
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
```bash
VITE_API_BASE_URL=https://<your-backend-url>.up.railway.app
```
6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. Your frontend will be live at: `https://subscription-graveyard.vercel.app`

---

### Step 6: Update CORS in Backend

1. Go back to **Railway dashboard**
2. Click on **backend service**
3. Go to **"Variables"**
4. Update `CORS_ORIGINS` with your Vercel URL:
```bash
CORS_ORIGINS=https://subscription-graveyard.vercel.app
```
5. Save and redeploy

---

### Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Try to register a new account
3. Login
4. Add a subscription
5. Check the dashboard

✅ **If everything works, you're LIVE!**

---

## 🚀 ALTERNATIVE: Deploy Frontend Only to Vercel

If you want to deploy just the frontend to Vercel and keep backend local for now:

### Quick Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd C:/GitHub/sub/frontend
vercel
```

4. **Follow prompts**:
   - Set up and deploy? → Yes
   - Which scope? → Your account
   - Link to existing project? → No
   - Project name? → subscription-graveyard
   - Directory? → ./
   - Detected: Vite → Yes
   - Override settings? → No

5. **Add environment variable**:
```bash
vercel env add VITE_API_BASE_URL
# Enter: http://localhost:8000 (for local backend)
# Or your Railway backend URL
```

6. **Deploy for production**:
```bash
vercel --prod
```

---

## 📝 Pre-Deployment Checklist

### ✅ Ready
- [x] Frontend configured for production
- [x] Backend has production settings
- [x] Environment examples provided
- [x] Database migrations ready
- [x] Git repository set up

### ⚠️ Before Deploying
- [ ] Generate secure JWT_SECRET_KEY
- [ ] Set up production database
- [ ] Configure CORS for production URLs
- [ ] Test all features locally
- [ ] Update environment variables

---

## 🔐 Security Checklist

Before going live:

1. **Generate Secure JWT Secret**:
```bash
openssl rand -hex 32
```

2. **Update Backend .env**:
```bash
JWT_SECRET_KEY=<your-generated-secret>
DEBUG=false
ENVIRONMENT=production
```

3. **Set Strong Database Password** (Railway does this automatically)

4. **Configure CORS** with your actual frontend URL

---

## 💰 Cost Estimate

### Free Tier (Recommended for Testing)

**Railway**:
- $5 free credit/month
- Should cover small usage
- No credit card required for trial

**Vercel**:
- Free tier: 100 GB bandwidth
- Perfect for personal projects
- No credit card required

**Total**: $0-5/month for low traffic

### Paid Tier (For Production)

**Railway**:
- ~$10-20/month for backend + database
- Scales automatically

**Vercel**:
- Free for frontend (usually sufficient)

**Total**: ~$10-20/month

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: Check CORS settings and VITE_API_BASE_URL

### Issue: Database connection failed
**Solution**: Verify DATABASE_URL is correct and database is running

### Issue: Migrations not applied
**Solution**: Run `railway run alembic upgrade head`

### Issue: 500 errors on backend
**Solution**: Check Railway logs → Backend service → "Deployments" → "Logs"

---

## 📊 Monitoring

After deployment:

1. **Railway Dashboard**:
   - Check logs for errors
   - Monitor usage
   - View deployment status

2. **Vercel Dashboard**:
   - Check build logs
   - Monitor analytics
   - View deployment status

---

## 🎉 You're Ready to Deploy!

**Recommended Path**: Start with Railway (Option A) - it's the easiest for beginners.

**Next Steps**:
1. Sign up for Railway
2. Follow Step-by-Step guide above
3. Deploy in ~15 minutes

Need help? Check Railway docs: https://docs.railway.app

---

## 🔄 Future Updates

To deploy updates:

### Frontend (Vercel)
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys!
```

### Backend (Railway)
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys!
```

Both platforms have automatic deployments when you push to GitHub! 🚀

---

**Good luck with your deployment!** 🎊
