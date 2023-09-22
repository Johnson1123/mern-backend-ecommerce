import express from "express";
import uploadImg from "./multer.js";
import { isSeller } from "./middleware/auth.js";
import {
  createEvent,
  deleteShopEvent,
  getAllEvent,
  getShopEvent,
} from "./controller/event.js";

const router = express.Router();

router.post("/create-event", uploadImg.array("images"), createEvent);
router.get("/get-all-shop-event/:id", getShopEvent);
router.get("/get-all-event/:id", getAllEvent);
router.get("/delete-shop-event/:id", isSeller, deleteShopEvent);

export default router;
