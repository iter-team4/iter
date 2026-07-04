import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// 1. Define the Mongoose Schema for a Route
interface IRoute extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  routeName: string;
  distanceMiles: number;
  waypoints: number[][]; // An array of [Longitude, Latitude] coordinate pairs
  createdAt: Date;
}

const routeSchema = new mongoose.Schema<IRoute>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeName: { type: String, required: true },
  distanceMiles: { type: Number, required: true },
  // [[Number]] tells MongoDB to expect an array of number arrays (e.g., [[-81.2, 28.6], [-81.3, 28.7]])
  waypoints: { type: [[Number]], required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const Route = (mongoose.models.Route as mongoose.Model<IRoute>) || mongoose.model<IRoute>('Route', routeSchema);

// ==========================================
// API Endpoint to Save a New Route
// ==========================================
router.post('/saveRoute', async (req: Request, res: Response) => {
  try {
    const { userId, routeName, distanceMiles, waypoints } = req.body;

    // 1. Basic validation
    if (!userId || !waypoints || waypoints.length < 2) {
      return res.status(400).json({ error: "A route must contain at least 2 waypoints." });
    }

    // 2. Create the new route document
    const newRoute = new Route({
      userId,
      routeName,
      distanceMiles,
      waypoints // Save the entire ordered array of coordinates!
    });

    // 3. Save to MongoDB
    const savedRoute = await newRoute.save();

    console.log("✅ New route saved for user:", userId);

    // 4. Send success back to the frontend
    res.status(201).json({
      message: "Route saved successfully!",
      route: savedRoute
    });

  } catch (error) {
    console.error("Route Save Error:", error);
    res.status(500).json({ error: "Server error while saving route." });
  }
});

// ==========================================
// 3. Load Routes API Endpoint
// ==========================================
// The frontend hits http://localhost:3000/APIs/routes/loadRoutes/:userId
router.get('/loadRoutes/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Verify the userId is a valid MongoDB ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Convert the string ID from the URL into a strict Mongoose ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    // Find all routes associated with this user ID, sorted by newest first
    const userRoutes = await Route.find({ userId: userObjectId }).sort({ createdAt: -1 });

    if (!userRoutes || userRoutes.length === 0) {
      return res.status(404).json({ message: "No routes found for this user." });
    }

    // Send the array of routes back to the frontend
    res.status(200).json({
      message: "Routes loaded successfully!",
      routes: userRoutes
    });

  } catch (error) {
    console.error("Route Load Error:", error);
    res.status(500).json({ error: "Server error while loading routes." });
  }
});

export default router;