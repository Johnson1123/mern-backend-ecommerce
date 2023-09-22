import jwt from "jsonwebtoken";

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.Jwt_SECRET, {
    expiresIn: "1d",
  });
};

const sendToken = (user, statusCode, res) => {
  const token = createActivationToken(user);
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export const generateCookie = (res, user) => {
  const token = jwt.sign({ user }, process.env.Jwt_SECRET, {
    expiresIn: "20d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });
};

export default sendToken;
