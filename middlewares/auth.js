const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const auth = {
  isAuthenticatedOperator: async (req, res, next) => {
    try {
      const token = req.cookies.token;
      console.log(token);
      if (!token) {
        return res.send("UnAuthorised access");
      }
      const decoded = await jwt.verify(token, JWT_SECRET);
      req.operatorId = decoded.operatorId;
      next();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
module.exports = auth;
