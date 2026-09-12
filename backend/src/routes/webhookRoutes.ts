import { Router } from "express";
import {
  createBin,
  captureWebhook,
  getBinRequests,
  deleteBin,
} from "../controllers/webhookController.js";

const router = Router();

router.post("/", createBin);
router.get("/:binId", getBinRequests);
router.delete("/:binId", deleteBin);
router.all("/:binId/collect", captureWebhook);

export default router;
