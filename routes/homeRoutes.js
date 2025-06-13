const express = require("express");
const homeController = require("../controllers/homeController");
const auth = require("../middlewares/auth");
const homeRouter = express.Router();

homeRouter.get("/",auth.isAuthenticatedUser, homeController.get);
homeRouter.post("/", homeController.post);

module.exports = homeRouter;
//this is home route
