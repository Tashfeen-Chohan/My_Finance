import { Router } from "express";
import { getPublicTestData } from "../controllers/publicTestController";

const router = Router();

// GET /api/public/test-data (or GET /api/test-db)
router.get("/test-data", getPublicTestData);

export default router;
