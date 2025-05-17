const express = require("express");
const morgan = require("morgan");
const logger = require("./middlewares/logger");
const homeRouter = require("./routes/homeRoutes");
const app = express();
const port = 3000;
app.use(logger);
app.use("/", homeRouter);

module.exports = app;
