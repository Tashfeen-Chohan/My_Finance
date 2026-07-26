import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { updateSettingsSchema } from "../validations/settingsValidation";

const router = Router();

router.use(authenticateJwt);

router.get("/", asyncHandler(getSettings));
router.put("/", validateRequest(updateSettingsSchema), asyncHandler(updateSettings));

export default router;
