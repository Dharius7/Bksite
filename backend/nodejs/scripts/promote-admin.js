const connectDB = require('../config/database');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node promote-admin.js <email>');
  process.exit(1);
}

const run = async () => {
  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    console.log(`Updated ${user.email} to role=admin`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to update admin role:', error);
    process.exit(1);
  }
};

run();
