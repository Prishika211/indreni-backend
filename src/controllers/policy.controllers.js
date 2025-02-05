import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Policy } from "../models/policy.models.js"; 
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import mongoose from 'mongoose'; 
import { owner } from "../constants.js";

const getPolicy = asyncHandler(async (req, res) => {
    const { policyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(policyId)) {
        throw new ApiError(400, "Invalid policy ID policy");
    }

    const policy = await Policy.findById(policyId);
    if (!policy) {
        throw new ApiError(404, "Invalid policy ID policy");
    }

    return res.status(200).json(new ApiResponse(200, policy, "Policy retrieved successfully"));
});

const getAllPolicies = asyncHandler(async (req, res) => {
    const policies = await Policy.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, policies, "Policies fetched successfully"));
});

// const createPolicy = asyncHandler(async (req, res) => {
//     const policyLocalPath = req.file?.path;
//     if (!mongoose.Types.ObjectId.isValid(req.admin._id)) {
//         throw new ApiError(400, "Invalid admin ID");
//     }

//     const policy = await uploadOnCloudinary(policyLocalPath);
//     if(!policy?.url){
//         throw new ApiError(400, "Error while uploading file");
//     }

//     const newPolicy = await Policy.create({
//         policyUrls: policy.url,
//         owner: req.admin._id, 
//     });

//     return res.status(201).json(new ApiResponse(201, newPolicy, "Policy created successfully"));
// });

const createOrUpdatePolicy = asyncHandler(async (req, res) => {
    // const policyLocalPath = req.file?.path;
    // if (!policyLocalPath) {
    //     throw new ApiError(400, "No policy file uploaded");
    // }

    // if (!mongoose.Types.ObjectId.isValid(req.admin._id)) {
    //     throw new ApiError(400, "Invalid admin ID");
    // }

    // const policy = await uploadOnCloudinary(policyLocalPath);
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }
    const policy = req.file.path;
    // if (!policy?.url) {
    //     throw new ApiError(400, "Error while uploading file");
    // }

    // Delete the existing policy
    await Policy.deleteMany();

    // Create the new policy
    const newPolicy = await Policy.create({
        policyUrls: policy,
        owner: owner,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newPolicy, "Policy created or updated successfully"));
});

// const updatePolicy = asyncHandler(async (req, res) => {
//     const { policyId } = req.params;
//     const policyLocalPath = req.file?.path;

//     if (!mongoose.Types.ObjectId.isValid(policyId)) {
//         throw new ApiError(400, "Invalid Policy ID policy");
//     }

//     const updateFields = {};
//     if(policyLocalPath){
//         const policy = await uploadOnCloudinary(policyLocalPath);
//         if(!policy?.url){
//             throw new ApiError(400, "Error while uploading image");
//         }
//         updateFields.policyUrls = policy.url;
//     }


//     const updatedPolicy = await Policy.findByIdAndUpdate(
//         policyId,
//         { $set: updateFields },
//         { new: true }
//     );

//     if (!updatedPolicy) {
//         throw new ApiError(404, "Policy not found");
//     }

//     return res.status(200).json(new ApiResponse(200, updatedPolicy, "Policy updated successfully"));
// });


const deletePolicy = asyncHandler(async (req, res) => {
    const { policyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(policyId)) {
        throw new ApiError(400, "Invalid Policy ID Policy");
    }
    
    const deletedPolicy = await Policy.findByIdAndDelete(policyId);
    if (!deletedPolicy) {
        throw new ApiError(404, "Policy not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Policy deleted successfully"));
});


export {
    getAllPolicies,
    createOrUpdatePolicy,
    deletePolicy,
    getPolicy
};