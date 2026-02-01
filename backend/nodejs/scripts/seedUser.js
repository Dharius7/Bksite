const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Account = require('../models/Account');
require('dotenv').config();

const seedUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coral-credit-bank', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'infobank@gmail.com' });
    
    if (existingUser) {
      console.log('User already exists. Updating password...');
      // Update password
      existingUser.password = await bcrypt.hash('1234567890', 12);
      if (!existingUser.username) {
        existingUser.username = 'infobank';
      }
      existingUser.role = 'admin';
      existingUser.kycStatus = 'approved';
      existingUser.accountStatus = 'active';
      existingUser.isVerified = true;
      await existingUser.save();
      console.log('Password updated successfully!');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('1234567890', 12);

      // Generate account ID
      const accountId = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      
      // Generate account number
      const generateAccountNumber = () => {
        let accountNumber = '';
        for (let i = 0; i < 16; i++) {
          accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
      };

      // Create user
      const user = new User({
        firstName: 'Info',
        lastName: 'Bank',
        email: 'infobank@gmail.com',
        username: 'infobank',
        phone: '1-800-BANKING',
        password: hashedPassword,
        dateOfBirth: new Date('1990-01-01'),
        address: {
          street: 'Bank Lane & Bay Street Suite 102',
          city: 'Nassau',
          state: 'New Providence',
          zipCode: '12345',
          country: 'Bahamas',
        },
        accountId: accountId,
        kycStatus: 'approved',
        accountStatus: 'active',
        isVerified: true,
        role: 'admin',
      });

      await user.save();
      console.log('User created successfully!');

      // Create primary account
      const account = new Account({
        userId: user._id,
        accountNumber: generateAccountNumber(),
        accountType: 'checking',
        balance: 20000000.00, // $20,000,000 as shown in the dashboard
        currency: 'USD',
        bitcoinBalance: 0,
        isPrimary: true,
        status: 'active',
      });

      await account.save();
      console.log('Account created successfully!');
      console.log(`\nLogin Credentials:`);
      console.log(`Email: infobank@gmail.com`);
      console.log(`Password: 1234567890`);
      console.log(`Account ID: ${accountId}`);
      console.log(`Account Number: ${account.accountNumber}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
