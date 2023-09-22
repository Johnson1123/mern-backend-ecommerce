import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import Shop from "../model/shop.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      res.status(400);
      throw new Error("Invalid shop id");
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

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

export const getAllProduct = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });
    if (products.length === 0) {
      res.status(400);
      throw new Error("No product yet");
    }
    res.status(200).json({
      message: true,
      products,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const deleteShopProduct = asyncHandler(async (req, res, next) => {
  try {
    const shopProductId = req.params.id;

    const productData = await Event.findById(shopProductId);

    productData.images.forEach((imageUrls) => {
      const filename = imageUrls;
      const filePath = `uploads/${filename}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    const productId = await Product.findByIdAndDelete(shopProductId);
    if (!productId) {
      res.status(400);
      throw new Error("Product not found");
    }
    res.status(201).json({
      success: true,
      message: "product deleted successfully",
      productId,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
