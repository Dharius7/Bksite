# Deployment Guide

This repo has a Next.js frontend and two backend options (Node.js and Python). The Node.js backend is production-ready. The Python backend is currently a minimal stub (login/register/accounts are TODO), so it should not be used for a real production environment without completing those endpoints.

## Frontend (Vercel)

1. Create a new Vercel project and import this repo.
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api`
3. Deploy.

## Backend (Render) - Node.js (recommended)

1. Create a new Render Web Service from `backend/nodejs`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variables (example values in `backend/nodejs/.env.example`):
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=...`
   - `JWT_SECRET=...` (long random string)
   - `CORS_ORIGIN=https://YOUR-VERCEL-APP.vercel.app`
5. Deploy.

## Backend (Render) - Python (not production-ready)

If you still want to deploy the Python stub:
1. Create a new Render Web Service from `backend/python`.
2. Build command: `pip install -r requirements.txt`
3. Start command: `gunicorn app:app`
4. Environment variables (example values in `backend/python/.env.example`):
   - `PORT=5000`
   - `FLASK_DEBUG=0`
   - `CORS_ORIGIN=https://YOUR-VERCEL-APP.vercel.app`

## Required Production Checks

- Verify that `NEXT_PUBLIC_API_URL` points to the correct backend.
- Ensure Render has `JWT_SECRET`, `MONGODB_URI`, and `CORS_ORIGIN` set.
- Confirm CORS allows only your Vercel domain (no wildcards in production).
