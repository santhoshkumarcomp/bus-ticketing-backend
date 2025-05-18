const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const authUserController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      //check whether the user already exist
      const user = await User.findOne({ email });
      if (user) {
        return res.send("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User registration success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.send("User does not exists");
      }
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        return res.send("invalid credentials");
      }
      const token = await jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "3h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 3 * 60 * 60 * 1000,
        secure: true,
        path: "/",
      });
      res.send("Logged in");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });
      res.send("Logging out");
    } catch (error) {
      res.status(500).send(error.messsage);
    }
  },
  me: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
module.exports = authUserController;
