import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { saveRun, loadRuns } from "../controllers/runController.js";

const router = Router();

router.post("/save", authMiddleware, saveRun);
router.get("/my-runs", authMiddleware, loadRuns);

export default router;
