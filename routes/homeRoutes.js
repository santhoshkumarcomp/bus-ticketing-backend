const express = require("express");
const homeController = require("../controllers/homeController");
const homeRouter = express.Router();

homeRouter.get("/", homeController.get);
homeRouter.post("/", homeController.post);

module.exports = homeRouter;
