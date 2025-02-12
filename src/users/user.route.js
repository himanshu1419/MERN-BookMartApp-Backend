require("dotenv").config();
const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("🔍 Received login request for:", username);

    const admin = await User.findOne({ username });
    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(404).json({ message: "Admin not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful, token generated");
    return res.status(200).json({
      message: "Authentication successful",
      token: token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Failed to login as admin", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
