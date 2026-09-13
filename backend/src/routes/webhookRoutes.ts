import { Router } from "express";
import {
  createBin,
  captureWebhook,
  getBinRequests,
  deleteBin,
  getRequestTypes,
} from "../controllers/webhookController.js";

const router = Router();

router.post("/", createBin);
router.get("/:binId", getBinRequests);
router.delete("/:binId", deleteBin);
router.all("/:binId/collect", captureWebhook);
router.get("/:binId/requests/:requestId/types", getRequestTypes);
export default router;
