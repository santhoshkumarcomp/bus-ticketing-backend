const express = require("express");
const {
  register,
  login,
  logout,
  me,
  create,
  getBuses,
  deleteBus,
  updateBus,
} = require("../controllers/authOperatorController");
const auth = require("../middlewares/auth");
const authOperatorRouter = express.Router();


authOperatorRouter.post("/register", register);
authOperatorRouter.post("/login", login);
authOperatorRouter.get("/logout", logout);
authOperatorRouter.get("/me", auth.isAuthenticatedOperator, me);
authOperatorRouter.post("/create", auth.isAuthenticatedOperator, create);
authOperatorRouter.get("/getBuses", auth.isAuthenticatedOperator, getBuses);
authOperatorRouter.put("/updateBus/:id",auth.isAuthenticatedOperator,updateBus)
authOperatorRouter.delete("/delete/:id",auth.isAuthenticatedOperator,deleteBus)
module.exports = authOperatorRouter;
