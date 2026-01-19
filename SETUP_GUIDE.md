# Setup Guide - Coral Credit Bank

This guide will help you set up and run the entire application without errors.

## Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (Local or Cloud) - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (free cloud option)

## Step-by-Step Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

This installs all frontend packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Lucide React (icons)

### 2. Install Backend Dependencies

```bash
cd backend/nodejs
npm install
cd ../..
```

This installs all backend packages including:
- Express.js
- Mongoose (MongoDB)
- JWT (JSON Web Tokens)
- Bcryptjs (Password hashing)
- CORS

### 3. Set Up Environment Variables

#### Backend Environment (.env file)

Create a file `backend/nodejs/.env` with the following content:

```env
PORT=5000
JWT_SECRET=coral-credit-bank-secret-key-change-in-production-2024
MONGODB_URI=mongodb://localhost:27017/coral-credit-bank
NODE_ENV=development
```

**If using MongoDB Atlas (cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coral-credit-bank
```

#### Frontend Environment (.env.local file)

Create a file `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

#### Option A: Local MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 5. Seed the Database (Create Test User)

Run this command to create a test user with login credentials:

```bash
cd backend/nodejs
npm run seed
cd ../..
```

This creates:
- **Email:** infobank@gmail.com
- **Password:** #Banks1234
- **Balance:** $20,000,000.00

### 6. Start the Backend Server

Open a terminal and run:

```bash
cd backend/nodejs
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
Server is running on port 5000
MongoDB Connected: ...
```

### 7. Start the Frontend Development Server

Open a **new terminal** (keep backend running) and run:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### 8. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Login Credentials

After running the seed script, use these credentials:

- **Email:** infobank@gmail.com
- **Password:** #Banks1234

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection error: ...`

**Solutions:**
1. Make sure MongoDB is running (check with `mongod --version`)
2. Check the connection string in `.env` file
3. If using Atlas, make sure your IP is whitelisted
4. Try changing `localhost` to `127.0.0.1`

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Change `PORT=5000` to `PORT=5001` in `backend/nodejs/.env`
2. Or stop the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill
   ```

### Module Not Found Errors

**Error:** `Cannot find module '...'`

**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Make sure you're in the correct directory

### TypeScript Errors

**Error:** Type errors in VS Code

**Solutions:**
1. Make sure TypeScript is installed: `npm install -g typescript`
2. Restart VS Code
3. Run `npm run build` to check for errors

### CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Make sure backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Backend already has CORS enabled - should work out of the box

## Project Structure

```
Bksite/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   └── ...
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── lib/                   # Utilities (API client)
├── backend/
│   └── nodejs/           # Backend API
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       └── middleware/   # Auth middleware
└── ...
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

### Backend
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start server
- `npm run seed` - Seed database with test user

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Start MongoDB
4. ✅ Seed database
5. ✅ Start backend server
6. ✅ Start frontend server
7. 🎉 Login and explore!

## Need Help?

If you encounter any errors:
1. Check all environment variables are set correctly
2. Make sure MongoDB is running
3. Check both servers are running (backend on 5000, frontend on 3000)
4. Check browser console for frontend errors
5. Check terminal for backend errors
