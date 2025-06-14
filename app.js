const express = require("express");
const morgan = require("morgan");
const logger = require("./middlewares/logger");
const homeRouter = require("./routes/homeRoutes");
const authOperatorRouter = require("./routes/authBusOperator");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authUserRouter = require("./routes/authUserRoutes");
const app = express();
const port = 3000;
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(logger);
app.use(morgan("dev"));
app.use("/", homeRouter);
app.use("/auth/busOperator", authOperatorRouter);
app.use("/auth/user", authUserRouter);
app.use("/home", homeRouter);
module.exports = app;
