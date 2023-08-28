import express from "express";
import { test_3d } from "../controllers/test_controller.js";

const router = express.Router();

router.get('/3d', test_3d);

export default router;