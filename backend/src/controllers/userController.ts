import type { Request, Response } from "express";
import User from "../models/User.js";

export const getMe = async (req: Request, res: Response) => {
  try {
    const cognitoSub = req.user?.sub;
    const email = req.user?.email;

    if (!cognitoSub || !email) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Try finding by Cognito sub first
    let user = await User.findOne({ cognitoSub });

    // If not found, try by email
    if (!user) {
      user = await User.findOne({ email });

      // Upgrade placeholder cognitoSub
      if (user) {
        user.cognitoSub = cognitoSub;
        await user.save();
      }
    }

    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    return res.json(user);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
