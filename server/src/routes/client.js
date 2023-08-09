import express from "express";
import {
  fetchProducts,
  fetchMerchants,
  fetchTransactions,
  fetchRefunds,
  fetchGeography
} from "../controllers/client_controller.js";

const router = express.Router();

router.get("/products", fetchProducts);
router.get("/merchants", fetchMerchants);
router.get("/transactions", fetchTransactions);
router.get("/refunds", fetchRefunds);
router.get("/geography", fetchGeography);

export default router;
