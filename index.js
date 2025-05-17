const mongoose = require("mongoose");

const app = require("./app");

require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MONGODB");
    app.listen(3000, () => {
      console.log(`Server listening on port 3000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
