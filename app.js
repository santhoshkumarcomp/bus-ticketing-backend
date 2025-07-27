const express = require("express");
const morgan = require("morgan");
const logger = require("./middlewares/logger");
const cors = require("cors");

const authOperatorRouter = require("./routes/authBusOperator");
const cookieParser = require("cookie-parser");
const authUserRouter = require("./routes/authUserRoutes");
const homeUserRouter = require("./routes/homeRoutes");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "https://bus-ticketing-frontend-oilryxke9.vercel.app", // Add your frontend URLs
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());
app.use(logger);

app.use("/auth/busOperator", authOperatorRouter);
app.use("/auth/user", authUserRouter);
app.use("/home/user", homeUserRouter);
module.exports = app;
