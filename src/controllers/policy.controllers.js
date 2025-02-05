import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Policy } from "../models/policy.models.js"; 
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

const createOrUpdatePolicy = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
      }
    const policy = req.file.path;
    await Policy.deleteMany();

    const newPolicy = await Policy.create({
        policyUrls: policy,
        owner: owner,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newPolicy, "Policy created or updated successfully"));
});

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