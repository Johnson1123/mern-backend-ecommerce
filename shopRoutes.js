import express from "express";
import { protect } from "./middleware/authMiddleware.js";
import uploadImg from "./multer.js";
import { isAuthenticated, isSeller } from "./middleware/auth.js";
import {
  activateSeller,
  createShop,
  getSeller,
  loginSeller,
  profileSeller,
} from "./controller/shop.js";

const router = express.Router();
//
router.post("/create-shop", uploadImg.single("file"), createShop);
// router.post("/activation", activateSeller);

router.post("/login-seller", loginSeller);
router.get("/get-seller", isSeller, getSeller);
router.get("/profile-seller/:shopId", profileSeller);
// router.get("/logout", logout);

// router
//   .route("/getuser")
//   .get(isAuthenticated, getUserProfile)
//   .put(protect, updateUserProfile);

export default router;
