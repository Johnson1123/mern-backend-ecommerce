import express from "express";
// import uploadImg from "./multer.js";
// import { isSeller } from "./middleware/auth.js";

import { createOrder } from "./controller/order.js";

const router = express.Router();

router.post("/create-order", createOrder);

export default router;
