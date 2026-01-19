# Database Seeding Instructions

This script creates a default user with the following credentials:

**Email:** infobank@gmail.com  
**Password:** #Banks1234

## Prerequisites

1. Make sure MongoDB is running (either locally or provide a connection string)
2. Install dependencies: `npm install`

## Running the Seed Script

### Option 1: Using npm script
```bash
npm run seed
```

### Option 2: Direct node execution
```bash
node scripts/seedUser.js
```

## What it does

- Creates a user with email `infobank@gmail.com`
- Sets password to `#Banks1234` (hashed with bcrypt)
- Creates a primary checking account with balance of $20,000,000.00
- Sets account status to active and KYC status to approved

## Environment Variables

The script uses the same MongoDB connection as your server. Make sure you have `.env` file with:

```
MONGODB_URI=mongodb://localhost:27017/coral-credit-bank
```

Or set it in your environment.

## Notes

- If the user already exists, it will update the password to `#Banks1234`
- The account number is randomly generated
- The account ID is automatically generated
