import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Shop from "../model/shop.js";
import asyncHandler from "express-async-handler";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    res.status(401);
    throw new Error("Please login to continue");
  }

  const decoded = jwt.verify(token, process.env.Jwt_SECRET);

  req.user = await User.findById(decoded.user._id);

  next();
});

export const isSeller = asyncHandler(async (req, res, next) => {
  const seller_token = req.header("authorization");
  if (!seller_token) {
    res.status(401);
    throw new Error("Please login to continue");
  }
  const decoded = jwt.verify(seller_token, process.env.Jwt_SECRET);

  req.seller = await Shop.findById(decoded.seller._id);

  next();
});

// export const isSeller = catchAsyncErrors(async (req, res, next) => {
//   const { seller_token } = req.cookies;
//   if (!seller_token) {
//     return next(new ErrorHandler("Please login to continue", 401));
//   }

//   const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

//   req.seller = await Shop.findById(decoded.id);

//   next();
// });

// export const isAdmin = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(`${req.user.role} can not access this resources!`)
//       );
//     }
//     next();
//   };
// };
