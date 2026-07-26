import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET =
  process.env.JWT_SECRET || "fallback_secret_key";

// Create a JWT token
export const createToken = (
  userId: string,
  name: string,
  username: string,
  email: string
) => {
  try {
    const payload = {
      id: userId,
      name,
      username,
      email,
    };

    const accessToken = jwt.sign(payload, SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, error: "" };
  } catch (error) {
    return { accessToken: "", error: "Failed to create token" };
  }
};

// Check if token is expired
export const isExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };

    if (!decoded || !decoded.exp) {
      return true;
    }

    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};