import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();
const port = process.env.PORT || 5000;

import userRoutes from "./userRoutes.js";
import shopRoutes from "./shopRoutes.js";
import productRoutes from "./productRoutes.js";
import eventRoutes from "./eventRoute.js";
import couponRoutes from "./couponRoute.js";
import orderRoutes from "./orderRoute.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/product", productRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/order", orderRoutes);

connectDB();

app.get("/", (req, res) => res.send("server is ready"));

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`server started on port ${port}`));

// const connectDatabase = require("./db/Database");
// const app = require("./app");
// const mongoose = require("mongoose");

// // Handling uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`shutting down the server for handling uncaught exception`);
// });

// // config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({
//     path: "config/.env",
//   });
// }

// // connect db
// connectDatabase();

// // create server
// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });

// // unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Shutting down the server for ${err.message}`);
//   console.log(`shutting down the server for unhandle promise rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
