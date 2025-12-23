import Group from "../models/Group.js";
import catchAsync from "../utils/catchAsync.js";

export const createGroup = catchAsync(async (req, res) => {
  const { name, members = [] } = req.body;

  // Ensure creator is always a member
  const uniqueMembers = new Set([
    req.user.id,
    ...members
  ]);

  const group = await Group.create({
    name,
    members: Array.from(uniqueMembers),
    createdBy: req.user.id
  });

  res.status(201).json({
    status: "success",
    data: group
  });
});


export const getGroups = catchAsync(async (req, res) => {
  const groups = await Group.find({
    members: req.user.id
  });

  res.json(groups);
});
