const BusOperator = require("../models/busOperator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const authOperatorController = {
  register: async (req, res) => {
    try {
      // parse the nescessary name, email, password from request
      const { name, email, password } = req.body;
      const busOperator = await BusOperator.findOne({ email });
      if (busOperator) {
        return res.send("Operator already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newBusOperator = new BusOperator({
        name,
        email,
        password: hashedPassword,
      });
      await newBusOperator.save();
      res.send("Operator registration success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const busOperator = await BusOperator.findOne({ email });
      if (!busOperator) {
        return res.send("Operator doesnt exists");
      }
      const isCorrectPassword = await bcrypt.compare(
        password,
        busOperator.password
      );
      if (!isCorrectPassword) {
        return res.send("Invalid credentials");
      }

      const token = await jwt.sign(
        { operatorId: busOperator._id },
        JWT_SECRET,
        { expiresIn: "3h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 3 * 60 * 60 * 1000,
        secure: true,
        path: "/",
      });
      res.send("logged in");
    } catch (error) {
      res.send(error);
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
      res.send("logout success");
    } catch (error) {
      res.send(error);
    }
  },
  me: async (req, res) => {
    try {
      const operatorId = req.operatorId;
      const busOperator = await BusOperator.findById(operatorId);
      res.json(busOperator);
    } catch (error) {
      res.send(error);
    }
  },
};
module.exports = authOperatorController;
