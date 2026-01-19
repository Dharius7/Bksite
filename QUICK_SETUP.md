# Quick Setup Guide

## ✅ Dependencies Already Installed!

All npm packages are installed. You don't need to run `npm install` again unless you add new packages.

## 📝 What You Need To Do Now

### Step 1: Create Environment Files (REQUIRED)

#### A. Backend `.env` file

**Location:** `backend/nodejs/.env`

Create this file manually with this content:

```env
PORT=5000
JWT_SECRET=coral-credit-bank-secret-key-change-in-production-2024
MONGODB_URI=mongodb://localhost:27017/coral-credit-bank
NODE_ENV=development
```

**Windows:**
1. Open `backend/nodejs/` folder in File Explorer
2. Create a new file named `.env` (not `.env.txt`)
3. Paste the content above
4. Save

#### B. Frontend `.env.local` file

**Location:** Root directory `.env.local`

Create this file manually with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Windows:**
1. Open root project folder (`Bksite`) in File Explorer
2. Create a new file named `.env.local`
3. Paste the content above
4. Save

### Step 2: Start MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB service is running on Windows
- Check in Services: `services.msc` → Find "MongoDB"

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/nodejs/.env`

### Step 3: Seed Database (Create Test User)

Open PowerShell/Command Prompt and run:

```bash
cd backend\nodejs
npm run seed
cd ..\..
```

This creates:
- Email: `infobank@gmail.com`
- Password: `#Banks1234`

### Step 4: Start Backend Server

Open a **new terminal** and run:

```bash
cd backend\nodejs
npm run dev
```

Wait for: `Server is running on port 5000`

### Step 5: Start Frontend Server

Open **another new terminal** (keep backend running) and run:

```bash
npm run dev
```

Wait for: `Local: http://localhost:3000`

### Step 6: Open Browser

Go to: **http://localhost:3000**

Login with:
- Email: `infobank@gmail.com`
- Password: `#Banks1234`

## ✅ Verification Checklist

- [ ] `.env` file exists in `backend/nodejs/`
- [ ] `.env.local` file exists in root directory
- [ ] MongoDB is running (local or cloud)
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with test credentials

## 📦 Installed Packages Summary

### Frontend ✓
- ✅ React 18.3.1
- ✅ Next.js 14.2.5
- ✅ TypeScript 5.5.4
- ✅ Tailwind CSS 3.4.7
- ✅ Axios 1.6.7 (API calls)
- ✅ Lucide React 0.424.0 (Icons)
- ✅ All TypeScript types

### Backend ✓
- ✅ Express 4.18.2
- ✅ Mongoose 8.0.3 (MongoDB)
- ✅ JWT 9.0.2 (Authentication)
- ✅ Bcryptjs 2.4.3 (Password hashing)
- ✅ CORS 2.8.5
- ✅ Dotenv 16.3.1
- ✅ Nodemon 3.0.2 (Auto-reload)

## 🎯 Quick Command Reference

```bash
# Seed database
cd backend\nodejs
npm run seed

# Start backend (Terminal 1)
cd backend\nodejs
npm run dev

# Start frontend (Terminal 2)
npm run dev
```

## 🐛 Troubleshooting

**Can't find module error?**
- Make sure you're in the correct directory
- Try `npm install` again

**MongoDB connection error?**
- Check MongoDB is running
- Verify `.env` file has correct `MONGODB_URI`

**Port already in use?**
- Close the process using port 5000 or 3000
- Or change PORT in `.env` file

**TypeScript errors?**
- Restart VS Code
- All types should be installed already

## ✨ Everything Should Work Now!

All code is ready, dependencies are installed. Just create the `.env` files and start the servers!
