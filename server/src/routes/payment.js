import express from "express";
import {
  process_hpp,
  process_2d,
  callback_transxnd_hpp,
  callback_mps,
  fetch_status,
  update_trans_status
} from "../controllers/payment_controller.js";
import {
  process_3d_initiate,
  process_3d_pay
} from "../controllers/payment_3d_controller.js"

const router = express.Router();

router.post("/hpp", process_hpp);
router.post("/2d", process_2d);
router.post("/3d/initialize", process_3d_initiate);
router.post("/3d/pay", process_3d_pay);
router.get("/callbackTransxndHpp", callback_transxnd_hpp);
router.post("/callbackMps", callback_mps);
router.post("/status", fetch_status);

router.get("/updateTransStatus", update_trans_status);

export default router;
