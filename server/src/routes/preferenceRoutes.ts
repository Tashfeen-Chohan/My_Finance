import { Router } from "express";
import { getPreferences, updatePreferences } from "../controllers/preferenceController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { updatePreferenceSchema } from "../validations/preferenceValidation";

const router = Router();

router.use(authenticateJwt);

router.get("/", asyncHandler(getPreferences));
router.put("/", validateRequest(updatePreferenceSchema), asyncHandler(updatePreferences));

export default router;
