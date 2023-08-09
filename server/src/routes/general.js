import express from "express";
import {
  fetchUser,
  getDashboardStats,
  getChartStats,
  getPieStats,
  signin,
  signup,
  updateUser,
  deleteUser,
  addUser,
} from "../controllers/general_controller.js";

const router = express.Router();

// router.post("/register", signup);
// router.post("/login", signin);
router.get("/user/:id", fetchUser);
router.get("/dashboard", getDashboardStats);
router.get("/chart", getChartStats);
router.get("/pie", getPieStats);
router.post("/updateUser", updateUser);
router.post("/addUser", addUser);
router.post("/deleteUser", deleteUser);

export default router;
