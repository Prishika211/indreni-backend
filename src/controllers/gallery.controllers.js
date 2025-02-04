import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Gallery } from "../models/gallery.models.js";

const addImagesToGallery = asyncHandler(async (req, res) => {
  const { title = "Gallery", category } = req.body;

  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }

  const imageUrl = req.file.path; // Cloudinary URL from Multer middleware

  const newImage = await Gallery.create({
    title,
    imageUrl: { main: imageUrl }, // Store Cloudinary URL
    category,
    metadata: {
      uploadedBy: null,
      size: req.file.size, // File size
      dimensions: {
        width: req.file.width || null, // Only if provided by Multer
        height: req.file.height || null,
      },
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newImage, "Image added to gallery"));
});

// Rest of the functions remain unchanged
const removeGalleryImage = asyncHandler(async (req, res) => {
  const { galleryId } = req.params;
  const galleryImage = await Gallery.findById(galleryId);

  if (!galleryImage) {
    throw new ApiError(404, "Image not found in gallery");
  }

  await Gallery.findByIdAndDelete(galleryId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Image removed from gallery"));
});

const getAllGalleryImages = asyncHandler(async (req, res) => {
  const galleryImages = await Gallery.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        galleryImages,
        "All images from gallery fetched successfully"
      )
    );
});

export { addImagesToGallery, removeGalleryImage, getAllGalleryImages };
