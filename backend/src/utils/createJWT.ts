import jwt from "jsonwebtoken";
import "dotenv/config";


// The exact environment variable your professor requires
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
      email
    };

const SECRET =
  process.env.ACCESS_TOKEN_SECRET || "super_secret_key_change_me_in_production";

export function createToken(firstName: string, lastName: string, id: string) {
  try {
    const user = { userId: id, firstName, lastName };
    // Set to expire in 30 minutes
    const accessToken = jwt.sign(user, SECRET, { expiresIn: "30m" });
    return { accessToken: accessToken };
  } catch (e: any) {
    return { error: e.message };
  }
}


    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || "fallback_secret_key",
      { expiresIn: "7d" }
    );

    return { accessToken, error: "" };
  } catch (error) {
    return { accessToken: "", error: "Failed to create token" };
  }
};

// 2. Check if a token is expired (Required by authMiddleware.ts)
export const isExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    
    // If token can't be decoded or lacks an expiration timestamp, treat as expired
    if (!decoded || !decoded.exp) {
      return true;
    }

    // JWT expiration (exp) is in seconds; Date.now() is in milliseconds
    const expirationTimeMs = decoded.exp * 1000;
    return Date.now() >= expirationTimeMs;
  } catch (error) {
    return true;
  }
};