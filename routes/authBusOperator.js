const express = require("express");
const authOperatorController = require("../controllers/authOperatorController");
const authOperatorRouter = express.Router();

authOperatorRouter.post("/register", authOperatorController.register);
module.exports = authOperatorRouter;
