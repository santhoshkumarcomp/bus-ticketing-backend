const BusOperator = require("../models/busOperator");
const bcrypt = require("bcrypt");
const authOperatorController = {
  register: async (req, res) => {
    try {
      // parse the nescessary name, email, password from request
      const { name, email, password } = req.body;
      const busOperator = await BusOperator.findOne({ email });
      if (busOperator) {
        return res.send("Operator already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newBusOperator = new BusOperator({
        name,
        email,
        password: hashedPassword,
      });
      await newBusOperator.save();
      res.send("Operator registration success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
module.exports = authOperatorController;
