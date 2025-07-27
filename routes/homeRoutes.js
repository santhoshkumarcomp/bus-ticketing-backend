const express = require("express");
const {
  get,
  bookSlot,
  getTicket,
  cancelTicket,
  getAllBuses,
  getBookings,
  getAllBookings,
} = require("../controllers/homeController");
const homeUserRouter = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");

homeUserRouter.get("/user", isAuthenticatedUser, get);
homeUserRouter.get("/getAllBuses", isAuthenticatedUser, getAllBuses);
homeUserRouter.get("/getBookings/:id", isAuthenticatedUser, getBookings);
homeUserRouter.get("/getAllBookings", isAuthenticatedUser, getAllBookings);
homeUserRouter.put("/book", isAuthenticatedUser, bookSlot);
// homeUserRouter.post("/book-ticket", isAuthenticatedUser, bookSlot);
// homeUserRouter.get("/get-ticket",isAuthenticatedUser, getTicket);
// homeUserRouter.post("/cancel-ticket", isAuthenticatedUser, cancelTicket);

module.exports = homeUserRouter;
//this is home route
