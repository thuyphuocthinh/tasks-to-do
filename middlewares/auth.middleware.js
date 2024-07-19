const Users = require("../models/users.model");

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = await Users.findOne({ token: token });
      if (user) {
        req.user = user;
        next();
      } else {
        res.json({
          status: 400,
          message: "Invalid token",
        });
      }
    } else {
      res.json({
        status: 400,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 404,
      message: "You are unauthorized to access this page",
    });
  }
};
