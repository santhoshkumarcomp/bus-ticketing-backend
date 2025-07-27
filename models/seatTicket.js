const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    seats: {
      type: [
        {
          number: {
            type: Number,
          },
          isBooked: {
            type: Boolean,
            default: false,
          },
          row: {
            type: Number,
          },
          column: {
            type: Number,
          },
          passengerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
          },
          id: {
            type: String,
            default: null,
          },
          price: {
            type: Number,
            default: 0,
          },
        },
      ],
      validate: {
        validator: function (val) {
          return val.length < 40 && val.length > 0;
        },
        message: "{PATH} must contain exactly 40 slots",
      },
    },
  },
  { timestamps: true }
);
const Ticket = mongoose.model("Ticket", ticketSchema, "ticket");
module.exports = Ticket;
