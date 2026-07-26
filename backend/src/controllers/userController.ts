import type { Request, Response } from "express";
import User from "../models/User.js";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Look up the user by their MongoDB ID directly
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
