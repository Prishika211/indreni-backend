import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Publication } from "../models/publication.models.js"; 
// import {uploadOnCloudinary} from "../utils/cloudinary.js";
import mongoose from 'mongoose'; 
import { owner } from "../constants.js";

const getPublication = asyncHandler(async (req, res) => {
    const { publicationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new ApiError(400, "Invalid publication ID format");
    }

    const publication = await Publication.findById(publicationId);
    if (!publication) {
        throw new ApiError(404, "Invalid publication ID format");
    }

    return res.status(200).json(new ApiResponse(200, publication, "Publication retrieved successfully"));
});

const getAllPublications = asyncHandler(async (req, res) => {
    const publications = await Publication.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, publications, "Publications fetched successfully"));
});

const createPublication = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // const publicationLocalPath = req.file?.path;
    console.log(description);
    // console.log(publicationUrls);
    // console.log(publicationLocalPath);
    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    // if (!mongoose.Types.ObjectId.isValid(req.admin._id)) {
    //     throw new ApiError(400, "Invalid admin ID");
    // }

    if (!req.file) {
        throw new ApiError(400, "No publication uploaded");
      }
    const publication = await req.file.path;


    const newPublication = await Publication.create({
        title: title || "Untitled Publication",
        description,
        publicationUrls: publication,

        owner: owner, 
    });

    return res.status(201).json(new ApiResponse(201, newPublication, "Publication created successfully"));
});

const updatePublication = asyncHandler(async (req, res) => {
    const { publicationId } = req.params;
    const { title, description } = req.body;
    // const publicationLocalPath = req.file?.path;

    if (!mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new ApiError(400, "Invalid publication ID format");
    }

    const updateFields = {};
    if (title){
        updateFields.title = title;
    } 
    if (description) updateFields.description = description;
    // if (publicationUrls) updateFields.publicationUrls = publicationUrls;
    // if(publicationLocalPath){
    //     const publication = await uploadOnCloudinary(publicationLocalPath);
    //     if(!publication?.url){
    //         throw new ApiError(400, "Error while uploading image");
    //     }
    //     updateFields.publicationUrls = publication.url;
    // }
    if (!req.file) {
        throw new ApiError(400, "No publication uploaded");
      }
    const publication = await req.file.path;
    updateFields.publicationUrls = publication;


    const updatedPublication = await Publication.findByIdAndUpdate(
        publicationId,
        { $set: updateFields },
        { new: true }
    );

    if (!updatedPublication) {
        throw new ApiError(404, "Publication not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedPublication, "Publication updated successfully"));
});


const deletePublication = asyncHandler(async (req, res) => {
    const { publicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(publicationId)) {
        throw new ApiError(400, "Invalid publication ID format");
    }
    
    const deletedPublication = await Publication.findByIdAndDelete(publicationId);
    if (!deletedPublication) {
        throw new ApiError(404, "Publication not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Publication deleted successfully"));
});


export {
    getAllPublications,
    createPublication,
    updatePublication,
    deletePublication,
    getPublication
};