import express from "express";

import { isSeller } from "./middleware/auth.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCouponValue,
} from "./controller/coupon.js";

const router = express.Router();

router.post("/create-coupon", createCoupon);
router.get("/get-coupon/:id", isSeller, getCoupon);
router.get("/delete-coupon/:id", isSeller, deleteCoupon);
router.get("/get-coupon-value/:name", getCouponValue);

export default router;
