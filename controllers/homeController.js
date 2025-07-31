const User = require("../models/user");
const BusOperator = require("../models/busOperator");
const Ticket = require("../models/seatTicket");
const Bus = require("../models/busDetails");
const { default: mongoose, model } = require("mongoose");

const homeController = {
  get: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);

      const bus = await Bus.find();
      res.send(bus);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
  getAllBuses: async (req, res) => {
    try {
      const buses = await Bus.find();

      res.json(buses);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
  bookSlot: async (req, res) => {
    try {
      console.log("Seats is array:", Array.isArray(req.body.seats));

      const { busId, seats } = req.body;
      const userId = req.userId;
      console.log(typeof seats[0].number);
      console.log(
        "🟢 Is valid ObjectId?",
        mongoose.Types.ObjectId.isValid(seats.passengerId)
      );
      let ticket = await Ticket.findOne({ busId });
      if (!ticket) {
        console.log("No ticket found, creating a new one");
        ticket = new Ticket({ busId: busId, seats: [] });
      }
      seats.forEach((seat) => {
        if (seat.isBooked === false) {
          seat.isBooked = true;
          seat.passengerId = userId;
        }
      });

      ticket.seats.push(...seats);

      await ticket.save();
      res.send("Slot booked successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
  getTicket: async (req, res) => {
    try {
      const userId = req.userId;
      const ticket = await Ticket.findOne({ "slots.bookedBy": userId });
      if (!ticket) {
        return res.send("No ticket found");
      }
      const actualTicket = ticket.slots.filter(
        (slot) => String(slot.bookedBy) === String(userId)
      );
      res.send(actualTicket);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  cancelTicket: async (req, res) => {
    try {
      const userId = req.userId;
      const { registrationNumber, slotNumber } = req.body;

      const ticket = await Ticket.findOne({
        "slots.bookedBy": userId,
        "slots.slotNumber": slotNumber,
      });
      const slot = ticket.slots.filter(
        (slot) => slot.slotNumber !== slotNumber
      );
      ticket.slots = slot;
      await ticket.save();
      res.send("Slot cancelled successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getBookings: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const tickets = await Ticket.find({ busId: id });
      console.log("Tickets found:", tickets);
      if (!tickets || tickets.length === 0) {
        return res.send("No bookings found");
      }
      const userBookings = tickets.map((ticket) => ({
        busId: ticket.busId,
        seats: ticket.seats,
      }));
      res.json(userBookings);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getAllBookings: async (req, res) => {
    try {
      const userId = req.userId;
      const tickets = await Ticket.find({ "seats.passengerId": userId });

      if (!tickets || tickets.length === 0) {
        return res.send("No bookings found");
      }

      const bookedTicketsFiltered = await Ticket.find({
        "seats.passengerId": userId,
      })
        .populate({
          path: "seats.passengerId",
          model: "User",
          select: "name email phone",
        })
        .populate({
          path: "busId",
          model: "Bus",
          select: "name operator from to departureTime arrivalTime date",
        })
        .lean(); // Use lean() for better performance if you don't need mongoose document methods
      
      // Filter seats to only include those belonging to the user
      const filteredResults = bookedTicketsFiltered.map(ticket => ({
        ...ticket,
        seats: ticket.seats.filter(seat => 
          seat.passengerId && seat.passengerId._id.toString() === userId.toString()
        ),
      }));
      
      res.json(filteredResults);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = homeController;
