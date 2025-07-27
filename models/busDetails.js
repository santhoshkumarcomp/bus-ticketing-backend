const mongoose = require("mongoose");
const BusOperator = require("./busOperator");
const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bus name is required"],
      trim: true,
      maxlength: [100, "Bus name cannot exceed 100 characters"],
    },

    operator: {
      type: String,
      required: [true, "Operator name is required"],
      trim: true,
      maxlength: [100, "Operator name cannot exceed 100 characters"],
    },

    from: {
      type: String,
      required: [true, "Departure location is required"],
      trim: true,
      maxlength: [100, "From location cannot exceed 100 characters"],
    },

    to: {
      type: String,
      required: [true, "Destination location is required"],
      trim: true,
      maxlength: [100, "To location cannot exceed 100 characters"],
    },

    departureTime: {
      type: String,
      required: [true, "Departure time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },

    arrivalTime: {
      type: String,
      required: [true, "Arrival time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Price must be a positive number",
      },
    },

    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [1, "Bus must have at least 1 seat"],
      max: [100, "Bus cannot have more than 100 seats"],
      validate: {
        validator: Number.isInteger,
        message: "Total seats must be a whole number",
      },
    },

    amenities: {
      type: [String],
      enum: [
        "WiFi",
        "AC",
        "Charging Port",
        "Refreshments",
        "Reclining Seats",
        "Entertainment",
        "Blanket",
        "Reading Light",
      ],
    },

    rating: {
      type: Number,
      default: 4.0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 5;
        },
        message: "Rating must be between 0 and 5",
      },
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (v) {
          return v >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Date cannot be in the past",
      },
    },

    // Additional useful fields
    availableSeats: {
      type: Number,
      default: function () {
        return this.totalSeats;
      },
      min: [0, "Available seats cannot be negative"],
      validate: {
        validator: function (v) {
          return v <= this.totalSeats;
        },
        message: "Available seats cannot exceed total seats",
      },
    },

    busType: {
      type: String,
      enum: ["AC", "Non-AC", "Sleeper", "Semi-Sleeper", "Volvo", "Ordinary"],
      default: "Ordinary",
    },

    status: {
      type: String,
      enum: ["Active", "Cancelled", "Delayed", "Completed"],
      default: "Active",
    },
    operatorId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusOperator",
      required: true,

    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Bus = mongoose.model("Bus", busSchema, "bus");
module.exports = Bus;




 
