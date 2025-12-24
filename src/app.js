import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

import AppError from "./utils/AppError.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// ✅ ENABLE CORS (THIS FIXES YOUR LOGIN ISSUE)
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

// ✅ 404 handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// ✅ Global error handler
app.use(errorHandler);

export default app;
