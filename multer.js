// const multer = require("multer");
// const path = require("path");
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round.apply(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png");
  },
});

const uploadImg = multer({
  storage: storage,
});

export default uploadImg;
