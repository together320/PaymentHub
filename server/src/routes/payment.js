import express from "express";
import {
  process_hpp,
  process_2d,
  process_3d,
  callback_transxnd_hpp,
  callback_mps,
  fetch_status
} from "../controllers/payment_controller.js";

const router = express.Router();

router.post("/hpp", process_hpp);
router.post("/2d", process_2d);
router.post("/3d", process_3d);
router.get("/callbackTransxndHpp", callback_transxnd_hpp);
router.post("/callbackMps", callback_mps);
router.post("/status", fetch_status);

export default router;
