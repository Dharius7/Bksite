# Installation Check List

## ✅ Completed Steps

1. **Dependencies Installed**
   - Frontend: `npm install` ✓
   - Backend: `cd backend/nodejs && npm install` ✓

## ⚠️ Required Setup Steps

### 1. Create Backend Environment File

**Location:** `backend/nodejs/.env`

**Content:**
```env
PORT=5000
JWT_SECRET=coral-credit-bank-secret-key-change-in-production-2024
MONGODB_URI=mongodb://localhost:27017/coral-credit-bank
NODE_ENV=development
```

**Create it manually:**
- Windows: Create a new file named `.env` in `backend/nodejs/` folder
- Copy the content above into it

### 2. Create Frontend Environment File

**Location:** `.env.local` (root directory)

**Content:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Create it manually:**
- Windows: Create a new file named `.env.local` in the root folder
- Copy the content above into it

### 3. Ensure MongoDB is Running

**Options:**
- **Local MongoDB:** Make sure MongoDB service is running
- **MongoDB Atlas:** Get your connection string and update `MONGODB_URI` in `.env`

### 4. Seed Database (Create Test User)

Run this in terminal:
```bash
cd backend/nodejs
npm run seed
```

This creates user:
- Email: infobank@gmail.com
- Password: #Banks1234

### 5. Start Backend Server

```bash
cd backend/nodejs
npm run dev
```

Should see: `Server is running on port 5000`

### 6. Start Frontend Server

```bash
npm run dev
```

Should see: `Local: http://localhost:3000`

## 📦 All Dependencies Installed

### Frontend Dependencies ✓
- react
- react-dom
- next
- lucide-react (icons)
- axios (API calls)
- typescript
- tailwindcss

### Backend Dependencies ✓
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- nodemon (dev)

## 🔍 Verification

After setup, verify:

1. ✅ Backend `.env` file exists
2. ✅ Frontend `.env.local` file exists
3. ✅ MongoDB is running
4. ✅ Backend server starts without errors
5. ✅ Frontend server starts without errors
6. ✅ Can access http://localhost:3000
7. ✅ Can login with test credentials

## 🐛 Common Issues & Solutions

### Issue: Cannot find module 'mongoose'
**Solution:** Run `cd backend/nodejs && npm install`

### Issue: MongoDB connection error
**Solution:** 
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env` is correct
- For Atlas: Whitelist your IP address

### Issue: Port already in use
**Solution:** Change PORT in `.env` or stop the process using the port

### Issue: Cannot find module '@/...'
**Solution:** 
- Make sure `tsconfig.json` has correct paths
- Restart VS Code
- Run `npm install` again

## ✨ Quick Start Commands

```bash
# 1. Create .env files (manual - see above)

# 2. Seed database
cd backend/nodejs
npm run seed
cd ../..

# 3. Start backend (terminal 1)
cd backend/nodejs
npm run dev

# 4. Start frontend (terminal 2)
npm run dev
```

## 🎯 Login Credentials

After seeding:
- **Email:** infobank@gmail.com
- **Password:** #Banks1234
