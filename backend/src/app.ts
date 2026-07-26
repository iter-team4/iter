import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import runRoutes from "./routes/runRoutes.js";

const app = express();

app.use((req, res, next) => {
  req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Bypass-Tunnel-Reminder",
      "User-Agent",
    ],
  }),
);

app.use(express.json());

// 3. MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/runs", runRoutes);
console.log("✅ All Express Routes Loaded");

app.use((req, res, next) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found" });
});

export default app;
