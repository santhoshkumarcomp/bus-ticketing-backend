const BusOperator = require("../models/busOperator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const Bus = require("../models/busDetails");
const mongoose = require("mongoose");
const authOperatorController = {
  register: async (req, res) => {
    try {
      // parse the nescessary name, email, password from request
      const { name, email, password, phone } = req.body;
      const busOperator = await BusOperator.findOne({ email });
      if (busOperator) {
        return res.status(401).send("Operator already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newBusOperator = new BusOperator({
        name,
        email,
        password: hashedPassword,
        phone,
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
  create: async (req, res) => {
    try {
      const operatorId = req.operatorId;
      function normalizeAmenities(amenities) {
        if (!amenities) return [];

        // If it's already an array, return as is
        if (Array.isArray(amenities)) {
          return amenities.filter(
            (item) => typeof item === "string" && item.trim() !== ""
          );
        }

        // If it's a string, try to parse it
        if (typeof amenities === "string") {
          try {
            // Try to parse as JSON array
            const parsed = JSON.parse(amenities);
            if (Array.isArray(parsed)) {
              return parsed.filter((item) => typeof item === "string");
            }
            // If not an array, treat as single item
            return [amenities];
          } catch {
            // If parsing fails, treat as single item
            return [amenities];
          }
        }

        return [];
      }
      

      const busData = req.body;
      const name = busData.name;
      const savedBus = await Bus.findOne({ name });
      if (savedBus) {
        return res.send("Bus already there");
      }

      const processedBusData = {
        ...busData,
        price: Number(busData.price),
        totalSeats: Number(busData.totalSeats),
        date: new Date(busData.date),
        amenities: normalizeAmenities(busData.amenities),
        operatorId,
      };

      console.log("Normalized amenities:", processedBusData.amenities);

      const bus = new Bus(processedBusData);
      await bus.save();

      res.send("bus info created successfully");
    } catch (error) {
      res.send(error.message);
    }
  },
  getBuses: async (req, res) => {
    try {
      const operatorId = req.operatorId;
      const buses = await Bus.find({ operatorId });
      console.log(buses);
      res.json(buses);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updateBus: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Update request body:", req.body);
      console.log("🟢 Is valid ObjectId?", mongoose.Types.ObjectId.isValid(id));

      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData._id;
      const bus = await Bus.findById(id);
      if (!bus) return res.status(404).json({ error: "Bus not found" });

      Object.assign(bus, updateData); // merge update data

      await bus.save(); // this will run all validators correctly

      res.status(200).json({ message: "Updated successfully", bus });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
  deleteBus: async (req, res) => {
    try {
      const id = req.params.id;
      await Bus.findByIdAndDelete(id);
      res.send("Bus info deleted successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
module.exports = authOperatorController;
