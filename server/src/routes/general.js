import express from "express";
import {
  fetchUser,
  getDashboardStats,
  getChartStats,
  getPieStats,
  signin,
  signup,
  addUser,
  updateUser,
  deleteUser,
  deleteTransaction,
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
router.post("/deleteTransaction", deleteTransaction);

export default router;
