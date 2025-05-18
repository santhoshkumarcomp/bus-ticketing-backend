const express = require("express");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authUserController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const authUserRouter = express.Router();
authUserRouter.post("/register", register);
authUserRouter.post("/login", login);
authUserRouter.get("/logout", logout);
authUserRouter.get("/me", isAuthenticatedUser, me);
module.exports = authUserRouter;
