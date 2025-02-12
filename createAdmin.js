require('dotenv').config()
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./src/users/user.model");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAdmin() {
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash manually

  const admin = new User({
    username: "admin",
    password: hashedPassword, // Store hashed password
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created with hashed password!");
  mongoose.disconnect();
}

createAdmin();
