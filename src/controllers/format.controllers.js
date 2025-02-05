import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Format } from "../models/format.models.js"; 
import { owner } from "../constants.js";
import mongoose from 'mongoose'; 

const getFormat = asyncHandler(async (req, res) => {
    const { formatId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(formatId)) {
        throw new ApiError(400, "Invalid format ID format");
    }

    const format = await Format.findById(formatId);
    if (!format) {
        throw new ApiError(404, "Invalid format ID format");
    }

    return res.status(200).json(new ApiResponse(200, format, "Format retrieved successfully"));
});

const getAllFormats = asyncHandler(async (req, res) => {
    const formats = await Format.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, formats, "Formats fetched successfully"));
});

const createFormat = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
  
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const format = req.file.path;

    const newFormat = await Format.create({

        title: title || "Untitled Format",
        description: description || "No description provided",
        formatUrls: format,
        owner: owner,
    });

    return res.status(201).json(new ApiResponse(201, newFormat, "Format created successfully"));
});

const updateFormat = asyncHandler(async (req, res) => {
    const { formatId } = req.params;
    const { title, description } = req.body;

    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
    }

    const updateFields = {};
    if (title){
        updateFields.title = title;
    } 
    if (description) updateFields.description = description;

    const format = req.file.path;
    updateFields.formatUrls = format; 


    const updatedFormat = await Format.findByIdAndUpdate(
        formatId,
        { $set: updateFields },
        { new: true }
    );

    if (!updatedFormat) {
        throw new ApiError(404, "Format not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedFormat, "Format updated successfully"));
});


const deleteFormat = asyncHandler(async (req, res) => {
    const { formatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(formatId)) {
        throw new ApiError(400, "Invalid format ID format");
    }
    
    const deletedFormat = await Format.findByIdAndDelete(formatId);
    if (!deletedFormat) {
        throw new ApiError(404, "Format not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Format deleted successfully"));
});


export {
    getAllFormats,
    createFormat,
    updateFormat,
    deleteFormat,
    getFormat
};