import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Format } from "../models/format.models.js"; 
import { owner } from "../constants.js";
// import {uploadOnCloudinary} from "../utils/cloudinary.js";
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
    // const formatLocalPath = req.file?.path;
    // if (!title || !formatLocalPath) {
    //     throw new ApiError(400, "Title and Format URL are required");
    // }

    
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // if (!mongoose.Types.ObjectId.isValid(req.admin._id)) {
    //     throw new ApiError(400, "Invalid admin ID");
    // }

    // const format = await uploadOnCloudinary(formatLocalPath);
    const format = req.file.path;
    // if(!format?.url){
    //     throw new ApiError(400, "Error while uploading file");
    // }

    const newFormat = await Format.create({

        title: title || "Untitled Format",
        description: description || "No description provided",
        formatUrls: format,
        // owner: req.admin._id, 
        owner: owner,
    });

    return res.status(201).json(new ApiResponse(201, newFormat, "Format created successfully"));
});

const updateFormat = asyncHandler(async (req, res) => {
    const { formatId } = req.params;
    const { title, description } = req.body;
    // const formatLocalPath = req.file?.path;

    // if (!mongoose.Types.ObjectId.isValid(formatId)) {
    //     throw new ApiError(400, "Invalid Format ID format");
    // }

    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
    }

    const updateFields = {};
    if (title){
        updateFields.title = title;
    } 
    // if (description) updateFields.description = description;
    // if(formatLocalPath){
    //     const format = await uploadOnCloudinary(formatLocalPath);
    //     if(!format?.url){
    //         throw new ApiError(400, "Error while uploading image");
    //     }
    //     updateFields.formatUrls = format.url;
    // }
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