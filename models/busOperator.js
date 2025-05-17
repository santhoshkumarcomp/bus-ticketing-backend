const mongoose = require("mongoose");
const operatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    permit: {
      type: String,
    },
    license: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    picture: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const BusOperator = mongoose.model(
  "BusOperator",
  operatorSchema,
  "busOperator"
);
module.exports = BusOperator;
