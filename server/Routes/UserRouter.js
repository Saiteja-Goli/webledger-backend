const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const userModel = require("../Models/userModel");
const user_router = express.Router();

user_router.post("/", async (req, res) => {
  try {
    let { email, displayName, photoURL } = req.body;
    // Checking Fields
    if (!email && !photoURL && !displayName)
      return res.status(400).json({
        error: "Improper Login Fields.",
      });
    // Checking Email
    let user = await userModel.findOne({ email });
    if (!user) {
      let newUser = new userModel({ email, displayName, photoURL });
      const savedUser = await newUser.save({ new: true }); // Use { new: true } option here
      console.log("Saved User:", savedUser);
      // Generating Token and RefreshToken
      let token = jwt.sign(req.body, "process.env.SECRET", { expiresIn: "1h" });
      return res.status(201).json({ data: savedUser, token });
      //If user Exists
    } else {
      let token = jwt.sign({ user }, "process.env.SECRET", { expiresIn: "1h" });
      return res.status(201).json({ data: user, token });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = user_router;
