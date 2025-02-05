import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Story } from "../models/story.models.js"; 
import mongoose from 'mongoose'; 
import { owner } from "../constants.js";

// Get a story by ID
const getStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
        throw new ApiError(400, "Invalid story ID format");
    }

    const story = await Story.findById(storyId);
    if (!story) {
        throw new ApiError(404, "Story not found");
    }

    return res.status(200).json(new ApiResponse(200, story, "Story retrieved successfully"));
});

// Get all stories
const getAllStories = asyncHandler(async (req, res) => {
    const stories = await Story.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, stories, "Stories fetched successfully"));
});

// Create a new story
const createStory = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
      }
    const image = req.file.path;

    const newStory = await Story.create({
        title,
        description,
        imageUrls: [image], // Store the image URL
        owner: owner, // Assuming the admin is the owner
    });

    return res.status(201).json(new ApiResponse(201, newStory, "Story created successfully"));
});

// Update an existing story
const updateStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const { title, description } = req.body;

    const updateFields = {};
    if (title){
        updateFields.title = title;
    } 
    if (description) updateFields.description = description;

    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
      }
      const image = req.file.path;
      updateFields.imageUrls = [image];

    const updatedStory = await Story.findByIdAndUpdate(
        storyId,
        { $set: updateFields },
        { new: true }
    );

    if (!updatedStory) {
        throw new ApiError(404, "Story not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedStory, "Story updated successfully"));
});

const deleteStory = asyncHandler(async (req, res) => {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
        throw new ApiError(400, "Invalid story ID format");
    }
    
    const deletedStory = await Story.findByIdAndDelete(storyId);
    if (!deletedStory) {
        throw new ApiError(404, "Story not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Story deleted successfully"));
});

export {
    getAllStories,
    createStory,
    updateStory,
    deleteStory,
    getStory,
};