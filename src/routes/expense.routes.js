import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { createExpenseValidator } from "../validators/expense.validator.js";
import validate from "../middlewares/validate.middleware.js";

import {
  addExpense,
  getGroupExpenses,
  getSettlement,
  getGroupTotal,
  getUserSpending,
  getCategoryStats,
  getMonthlyTrend,
  getNetBalances
} from "../controllers/expense.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  createExpenseValidator,
  validate,
  addExpense
);

router.get("/:groupId", auth, getGroupExpenses);
router.get("/:groupId/settlement", auth, getSettlement);

router.get("/:groupId/total", auth, getGroupTotal);
router.get("/:groupId/user-spending", auth, getUserSpending);
router.get("/:groupId/categories", auth, getCategoryStats);
router.get("/:groupId/monthly", auth, getMonthlyTrend);
router.get("/:groupId/net-balances", auth, getNetBalances);



export default router;
