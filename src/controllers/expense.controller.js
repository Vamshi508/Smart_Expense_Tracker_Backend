import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import calculateSettlement from "../services/settlement.service.js";
import generateSplits from "../services/splitGenerator.service.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const addExpense = catchAsync(async (req, res) => {
  const {
    amount,
    paidBy,
    participants,
    splitType,
    splitData,
    ...rest
  } = req.body;

  // Generate splits (business logic)
  const splits = generateSplits({
    amount,
    participants,
    splitType,
    splitData
  });

  if (!splits || splits.length === 0) {
    throw new AppError("Failed to generate splits", 400);
  }

  // Create expense
  const expense = await Expense.create({
    ...rest,
    amount,
    paidBy,
    splits
  });

  if (!expense) {
    throw new AppError("Expense creation failed", 500);
  }

  res.status(201).json({
    status: "success",
    data: expense
  });
});



export const getGroupExpenses = async (req, res) => {
  const expenses = await Expense.find({ groupId: req.params.groupId });
  res.json(expenses);
};

export const getSettlement = async (req, res) => {
  const expenses = await Expense.find({ groupId: req.params.groupId });
  const settlement = calculateSettlement(expenses);
  res.json(settlement);
};

export const getGroupTotal = catchAsync(async (req, res) => {
  const groupId = new mongoose.Types.ObjectId(req.params.groupId);

  const result = await Expense.aggregate([
    { $match: { groupId } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ]);

  res.json(result[0] || { totalAmount: 0 });
});


export const getUserSpending = catchAsync(async (req, res) => {
  const groupId = new mongoose.Types.ObjectId(req.params.groupId);

  const data = await Expense.aggregate([
    { $match: { groupId } },
    {
      $group: {
        _id: "$paidBy",
        totalPaid: { $sum: "$amount" }
      }
    }
  ]);

  res.json(data);
});


export const getCategoryStats = catchAsync(async (req, res) => {
  const groupId = new mongoose.Types.ObjectId(req.params.groupId);

  const data = await Expense.aggregate([
    { $match: { groupId } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ]);

  res.json(data);
});


export const getMonthlyTrend = catchAsync(async (req, res) => {
  const groupId = new mongoose.Types.ObjectId(req.params.groupId);

  const data = await Expense.aggregate([
    { $match: { groupId } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  res.json(data);
});


export const getNetBalances = catchAsync(async (req, res) => {
  const groupId = new mongoose.Types.ObjectId(req.params.groupId);

  const data = await Expense.aggregate([
    { $match: { groupId } },
    { $unwind: "$splits" },
    {
      $group: {
        _id: "$splits.userId",
        totalShare: { $sum: "$splits.share" }
      }
    }
  ]);

  res.json(data);
});

