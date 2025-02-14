const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

//Create a new user or register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    //bcrypt.genSalt generates a salt having 10 rounds of complexity
    //salt is a random string that is added to password before hashing
    //bcrypt.hash applies hashing algorithm using salt generating encrypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username,
      password: hashedPassword,
    });
    await user.save();

    //generates a token containing user id
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "4h" });

    //token is sent back to the client along with username
    //client can include the jwt token in authorization header while making request.
    res
      .status(201)
      .json({ message: "User registered successfully", token, username });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

// username : "John", password : "JohnTest"
// username : "Alice", password : "Alice"
// username : "Tony", password : "Tony"
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found." });

    //comparePassword methods is like user defined method
    //its defination present inside User model.
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res
      .status(200)
      .json({ message: "Login successfull", username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Server error while login.", error: error });
  }
});

module.exports = router;
