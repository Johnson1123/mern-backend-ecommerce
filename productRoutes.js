import express from "express";
import uploadImg from "./multer.js";
import {
  createProduct,
  deleteShopProduct,
  getAllProduct,
  getProducts,
} from "./controller/product.js";
import { isSeller } from "./middleware/auth.js";

const router = express.Router();
//
router.post("/create-product", uploadImg.array("images"), createProduct);
router.get("/get-all-product", getProducts);
router.get("/get-all-shop-product/:id", getAllProduct);
router.get("/delete-shop-product/:id", isSeller, deleteShopProduct);

// router
//   .route("/getuser")
//   .get(isAuthenticated, getUserProfile)
//   .put(protect, updateUserProfile);

export default router;
