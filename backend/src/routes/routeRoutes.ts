import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  saveRoute,
  loadRoutes,
  searchRoutes,
  deleteRoute,
} from "../controllers/routeController.js";

const router = Router();

router.get("/my-routes", authMiddleware, loadRoutes);
router.post("/save", authMiddleware, saveRoute);
router.get("/search", authMiddleware, searchRoutes);
router.delete("/:id", authMiddleware, deleteRoute);

export default router;
