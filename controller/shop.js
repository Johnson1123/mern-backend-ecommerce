import path from "path";
import asyncHandler from "express-async-handler";
import fs from "fs";
import sendMail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import sendToken from "../utils/jwtToken.js";
import Shop from "../model/shop.js";

export const createShop = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req?.file?.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500);
          throw new Error("Error handling delete file");
        }
      });
      res.status(400);
      throw new Error("Seller already exist");
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your account",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }

    let findSeller = await Shop.findOne({ email });

    if (findSeller) {
      res.status(400);
      throw new Error("Seller already exist");
    } else {
      const { name, password, avatar, zipCode, address, phoneNumber, email } =
        seller;
      await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendToken(seller, 201, res);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createActivationToken = (user) => {
  return jwt.sign(user, process.env.Jwt_SECRET, {
    expiresIn: "5m",
  });
};

export const activateSeller = asyncHandler(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newSeller = jwt.verify(activation_token, process.env.Jwt_SECRET);

    if (!newSeller) {
      res.status(400);
      throw new Error("Invalid Token");
    }
    const { name, email, password, avatar, zipCode, address, phoneNumber } =
      newSeller;

    let seller = await Shop.findOne({ email });

    if (seller) {
      return next(new ErrorHandler("Sller already exists", 400));
    }

    seller = await Shop.create({
      name,
      email,
      avatar,
      password,
      zipCode,
      address,
      phoneNumber,
    });
    sendToken(seller, 201, res);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//activate user

// const activation = asyncHandler(async (req, res, next) => {
//   try {
//     const { activation_token } = req.body;

//     const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

//     if (!newUser) {
//       res.status(400);
//       throw new Error("Invalid token");
//     }
//     const { name, email, password, avatar } = newUser;

//     let user = await User.findOne({ email });

//     if (user) {
//       res.status(400);
//       throw new Error("user already exist");
//     }
//     user = await User.create({
//       name,
//       email,
//       avatar,
//       password,
//     });

//     sendToken(user, 201, res);
//   } catch (error) {
//     res.status(500);
//     throw new Error(`${error.message}`);
//   }
// });

export const loginSeller = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("please provide all field");
    }
    const seller = await Shop.findOne({ email }).select("+password");

    if (!seller) {
      res.status(400);
      throw new Error("seller not exist");
    }
    const isPassword = await seller.comparePassword(password);

    if (!isPassword) {
      res.status(400);
      throw new Error("Please, provide the correct information");
    }
    sendToken({ seller }, 201, res);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const getSeller = asyncHandler(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      res.status(400);
      throw new Error("");
    }
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const profileSeller = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const seller = await Shop.findById(shopId);
  if (!seller) {
    res.status(400);
    throw new Error("Seller not found");
  }
  res.status(200).json({
    message: "true",
    profileSeller: seller,
  });
});

// const logout = asyncHandler(async (req, res, next) => {
//   try {
//     res.status(201).json({
//       success: true,
//       message: "log out successful",
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });

// export { resgisterUser, activation, loginUser, logout };
