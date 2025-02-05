import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Notice} from '../models/notice.models.js';
import mongoose from 'mongoose';
import { owner } from "../constants.js";

// Get a notice by ID
const getNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(noticeId)) {
    throw new ApiError(400, 'Invalid notice ID format');
  }

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }

  res.status(200).json(new ApiResponse(200, notice, 'Notice retrieved successfully'));
});

// Get all notices
const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, notices, 'Notices fetched successfully'));
});

// Create a new notice
const createNotice = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }

  const image = req.file.path;

  const newNotice = await Notice.create({
    title,
    description,
    image: image,
    owner: owner,
  });

  res.status(201).json(new ApiResponse(201, newNotice, 'Notice created successfully'));
});

// Update an existing notice
const updateNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;
  const { title, description } = req.body;

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;

  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }

  const image = req.file.path;
  updateFields.image = image;

  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedNotice) {
    throw new ApiError(404, 'Notice not found');
  }

  res.status(200).json(new ApiResponse(200, updatedNotice, 'Notice updated successfully'));
});

// Delete a notice
const deleteNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noticeId)) {
    throw new ApiError(400, 'Invalid notice ID format');
  }

  const deletedNotice = await Notice.findByIdAndDelete(noticeId);
  if (!deletedNotice) {
    throw new ApiError(404, 'Notice not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Notice deleted successfully'));
});

export {
    getNotice,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice
}