import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Gallery } from "../models/gallery.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addImagesToGallery = asyncHandler(async (req, res) => {
    const {title="Gallery", category} = req.body;
    const imageLocalPath = req.file?.path;

    if(!(title || category || imageLocalPath)){
        throw new ApiError(400, "Missing required fields");
    }

    const image = await uploadOnCloudinary(imageLocalPath);
    if(!image?.url){
        throw new ApiError(
            400,
            "Error while uploading image"
        )
    }

    const newImage = await Gallery.create({
        title,
        imageUrl: {main: image.url},
        category,
        metadata: {
            uploadedBy: req.admin._id,
            size: image.bytes,
            dimensions: {
                width: image.width,
                height: image.height,
            },
        }
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                newImage, 
                "Image added to gallery"
            )
        );
})

const removeGalleryImage = asyncHandler(async (req, res) => {
    const {galleryId} = req.params;

    const galleryImage = await Gallery.findById(galleryId)

    if(!galleryImage)
        throw new ApiError(404, "Image not found in gallery");


    await Gallery.findByIdAndDelete(galleryId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "Image removed from gallery"
            )
        )
})

const getAllGalleryImages = asyncHandler(async (req, res) => {
    const galleryImages = await Gallery.find().sort({createdAt:-1})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                galleryImages, 
                "All images from gallery fetched successfully"
            )
        )
})


export {
    addImagesToGallery,
    removeGalleryImage,
    getAllGalleryImages
}