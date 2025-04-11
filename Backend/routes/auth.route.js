import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (user, res) => {
  const payLoad = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payLoad, process.env.JWT_KEY, { expiresIn: "1h" });
  console.log(`Generated token: ${token}`);

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export default generateToken;
