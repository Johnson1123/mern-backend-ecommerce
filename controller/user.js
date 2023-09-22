import path from "path";
import User from "../model/user.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import sendMail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import sendToken, { generateCookie } from "../utils/jwtToken.js";

const resgisterUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, file } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req?.file?.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(500);
          throw new Error("Error handling delete file");
        }
      });
      res.status(400);
      throw new Error("User already exist");
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }

    let findUser = await User.findOne({ email });

    if (findUser) {
      res.status(400);
      throw new Error("user already exist");
    } else {
      await User.create({
        name: name,
        email: email,
        password: password,
        avatar: fileUrl,
      });

      sendToken(user, 201, res);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.Jwt_SECRET, {
    expiresIn: "5m",
  });
};

//activate user

const activation = asyncHandler(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      res.status(400);
      throw new Error("Invalid token");
    }
    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      res.status(400);
      throw new Error("user already exist");
    }
    user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500);
    throw new Error(`${error.message}`);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("please provide all field");
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400);
      throw new Error("User not exist");
    }
    const isPassword = await user.comparePassword(password);

    if (!isPassword) {
      res.status(400);
      throw new Error("Please, provide the correct information");
    }

    sendToken({ user }, 201, res);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const logout = asyncHandler(async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      message: "log out successful",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400);
      throw new Error("User not Found");
    }

    const isPassword = await user.comparePassword(password);

    if (!isPassword) {
      res.status(400);
      throw new Error("Provide correct information");
    }

    user.name = name;
    user.phoneNumber = phoneNumber;
    user.email = email;

    await user.save();

    res.status(2001).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    if (req.body.avatar !== "") {
      const avatarPath = `uploads/${user.avatar}`;
      fs.unlink(avatarPath, (err) => {
        res.status(400);
        throw new Error("Unable to delete Image");
      });

      const filename = req.file.filename;
      const fileUrl = path.join(filename);

      user.avatar = fileUrl;
      await user.save();

      res.status(200).json({
        success: true,
        message: "image updatated successfully",
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateAddress = asyncHandler(async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      res.status(400);
      throw new Error("User not Found");
    }
    const existAddressType = await user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (existAddressType) {
      res.status(400);
      throw new Error(`${req.body.addressType} address already exist`);
    }

    const existsAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      // add the new address to the array
      user.addresses.push(req.body);
    }
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteAddress = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne(
      {
        _id: userId,
      },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  let user = await User.findById(req.user.id).select("+password");

  const isPassword = await user.comparePassword(oldPassword);

  if (!isPassword) {
    res.status(400);
    throw new Error("Provide correct credential");
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("Password not match");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
  });
});
export {
  resgisterUser,
  activation,
  loginUser,
  getUser,
  logout,
  updateUser,
  updateAvatar,
  updateAddress,
  deleteAddress,
  changePassword,
};
