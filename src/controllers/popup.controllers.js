import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Popup } from "../models/popup.models.js";

// Create a new popup
const createPopup = asyncHandler(async (req, res) => {
  const { title, content, isActive } = req.body;  

  try {
    if (!req.file) {
      throw new ApiError(400, "No image uploaded");
    }
    const photo = req.file.path;

    // Create the new popup with optional title, content, and isActive status
    const newPopup = await Popup.create({
      imageUrl: photo,
      title: title || "",  // Default to empty string if not provided
      content: content || "",  // Default to empty string if not provided
      isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
    });

    return res.status(201).json(
      new ApiResponse(201, newPopup, "Popup created successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Popup couldn't be created");
  }
});

// Get the current active popup
const getPopup = asyncHandler(async (req, res) => {
  const popup = await Popup.findOne({ isActive: true });

  if (!popup) {
    throw new ApiError(404, "No active popup found");
  }

  return res.status(200).json(
    new ApiResponse(200, popup, "Active popup retrieved successfully")
  );
});

// Update an existing popup by ID
const updatePopup = asyncHandler(async (req, res) => {
  const { popupId } = req.params;
  const { title, content, isActive } = req.body;
  const updateFields = {}; // Initialize update fields
  console.log(popupId);
  // Add fields to the update object only if they are provided
  if (title !== undefined) updateFields.title = title;
  if (content !== undefined) updateFields.content = content;
  if (isActive !== undefined) updateFields.isActive = isActive;

  // If a new image is provided, upload it to Cloudinary
  if (req.file?.path) {
    try {
      const photo = await req.file.path;
      updateFields.imageUrl = photo;
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "Internal Server Error during image upload");
    }
  }

  try {
    // Update the popup in the database
    const updatedPopup = await Popup.findByIdAndUpdate(
      popupId,
      { $set: updateFields }, // Set updated fields
      { new: true } // Return the updated document
    );

    if (!updatedPopup) {
      throw new ApiError(404, "Popup not found");
    }

    // Return the updated popup
    return res.status(200).json(
      new ApiResponse(200, updatedPopup, "Popup updated successfully")
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// Delete a popup by ID
const deletePopup = asyncHandler(async (req, res) => {
  const { popupId } = req.params;

  const deletedPopup = await Popup.findByIdAndDelete(popupId);

  if (!deletedPopup) {
    throw new ApiError(404, "Popup not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Popup deleted successfully")
  );
});

export { createPopup, getPopup, updatePopup, deletePopup };
