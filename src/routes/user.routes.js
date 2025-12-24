import express from "express";
import User from "../models/User.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all users (id + name only)
router.get("/", protect, async (req, res) => {
  const users = await User.find({}, "_id name");
  res.json(users);
});

export default router;
