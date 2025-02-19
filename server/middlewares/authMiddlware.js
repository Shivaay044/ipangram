const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BaseError } = require("../utils/error");



module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next(new BaseError("Access denied",403))

    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return next(new BaseError("Forbidden: You don't have permission",403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
