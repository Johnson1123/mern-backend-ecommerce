import asyncHandler from "express-async-handler";
import CoupounCode from "../model/coupon.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  try {
    const couponName = req.body.name;
    const existCoupon = await CoupounCode.find({ name: couponName });
    console.log(couponName);
    if (existCoupon.length !== 0) {
      res.status(400);
      throw new Error("Coupon already exist");
    }

    const coupon = await CoupounCode.create(req.body);

    res.status(201).json({
      message: "coupon create successfully",
      coupon,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getCoupon = asyncHandler(async (req, res, next) => {
  try {
    const couponId = req.params.id;
    const shopCoupon = await CoupounCode.find({ shopId: couponId });
    if (!shopCoupon) {
      res.status(400);
      throw new Error("Coupon not found");
    }
    res.status(200).json({
      success: true,
      shopCoupon,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  try {
    const couponId = req.params.id;

    const coupon = await CoupounCode.findByIdAndDelete(couponId);

    if (!coupon) {
      res.status(400);
      throw new Error("coupon not deleted");
    }

    res.status(201).json({
      message: "coupon deleted successfully",
      coupon,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getCouponValue = asyncHandler(async (req, res, next) => {
  try {
    const couponCode = await CoupounCode.findOne({ name: req.params.name });

    res.status(200).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
