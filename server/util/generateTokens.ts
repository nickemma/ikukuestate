import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

const secretKey = config.JWT.JWT_SECRET;
const accessTokenExpiration = config.JWT.JWT_EXPIRES_IN;
const refreshTokenExpiration = config.JWT.JWT_REFRESH_TOKEN;

export const generateTokens = (user: { _id: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role }, // Payload
    secretKey,
    { expiresIn: accessTokenExpiration } // Options (must be a string)
  );

  const refreshToken = jwt.sign(
    { id: user._id }, // Payload
    secretKey,
    { expiresIn: refreshTokenExpiration } // Options (must be a string)
  );

  return { accessToken, refreshToken };
};
