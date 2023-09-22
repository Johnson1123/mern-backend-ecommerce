import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../model/user.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.Jwt_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, Invalid Token");
    }
  } else {
    res.status(401);
    throw new Error(`Not Authorized, no token`);
  }
});

export { protect };
