const express = require("express");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authOperatorController");
const auth = require("../middlewares/auth");
const authOperatorRouter = express.Router();

authOperatorRouter.post("/register", register);
authOperatorRouter.post("/login", login);
authOperatorRouter.get("/logout", logout);
authOperatorRouter.get("/me", auth.isAuthenticatedOperator, me);
module.exports = authOperatorRouter;
