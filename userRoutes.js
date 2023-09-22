import express from "express";
import { protect } from "./middleware/authMiddleware.js";
import uploadImg from "./multer.js";
import {
  changePassword,
  deleteAddress,
  getUser,
  loginUser,
  logout,
  resgisterUser,
  updateAddress,
  updateAvatar,
  updateUser,
} from "./controller/user.js";
import { isAuthenticated } from "./middleware/auth.js";

const router = express.Router();
//
router
  .route("/")
  .post(uploadImg.single("file"), resgisterUser)
  .get(isAuthenticated, getUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/avatar", uploadImg.single("file"), isAuthenticated, updateAvatar);
router.delete("/address/:id", isAuthenticated, deleteAddress);
router.route("/address").put(isAuthenticated, updateAddress);

router.route("/user").put(isAuthenticated, updateUser);
router.put("/password", isAuthenticated, changePassword);

export default router;
