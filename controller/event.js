import fs from "fs";
import asyncHandler from "express-async-handler";
import Shop from "../model/shop.js";
import Event from "../model/event.js";

// create event
export const createEvent = asyncHandler(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      res.status(400);
      throw new Error("shop not found");
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);

      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop;

      const product = await Event.create(eventData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get Event

export const getShopEvent = asyncHandler(async (req, res, next) => {
  try {
    const shopEvent = await Event.find({ shopId: req.params.id });
    if (shopEvent.length === 0) {
      res.status(400);
      throw new Error("no event yet");
    }
    res.status(201).json({
      success: true,
      shopEvent,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get All Shop event
export const getAllEvent = asyncHandler(async (req, res, next) => {
  try {
    const event = await Event.find({});
    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const deleteShopEvent = asyncHandler(async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const eventData = await Event.findById(eventId);

    eventData.images.forEach((imageUrls) => {
      const filename = imageUrls;
      const filePath = `uploads/${filename}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      res.status(400);
      throw new Error("No event match");
    }
    res.status(201).json({
      message: "Event deleted successfully",
      event,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
