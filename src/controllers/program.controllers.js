import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Program } from "../models/program.models.js";

// Get all programs
const getAllPrograms = asyncHandler(async (req, res) => {
    const programs = await Program.find().sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, programs, "Programs fetched successfully"));
});

// Get present programs
const getPresentPrograms = asyncHandler(async (req, res) => {
    const presentPrograms = await Program.find({ isOngoing: true }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, presentPrograms, "Present programs fetched successfully"));
});

// Get past programs
const getPastPrograms = asyncHandler(async (req, res) => {
    const pastPrograms = await Program.find({ isOngoing: false }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, pastPrograms, "Past programs fetched successfully"));
});

// Create a new program
const createProgram = asyncHandler(async (req, res) => {
    const { name, objective, targetBeneficiaries, duration, budget, fundingPartner, remarks, isOngoing } = req.body;

    if (!name || !objective || !targetBeneficiaries || !duration || !budget ||  !fundingPartner || isOngoing === undefined) {
        throw new ApiError(400, "All fields and an image file are required");
    }

    try {

        const newProgram = await Program.create({
            name,
            objective,
            targetBeneficiaries,
            duration,
            budget,
            fundingPartner,
            remarks,
            isOngoing,
        });

        return res.status(201).json(new ApiResponse(201, newProgram, "Program created successfully"));
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
});


// Update an existing program
const updateProgram = asyncHandler(async (req, res) => {
    const { programId } = req.params;
    const { name, objective, targetBeneficiaries, duration, budget, fundingPartner, remarks, isOngoing } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (objective) updateFields.objective = objective;
    if (targetBeneficiaries) updateFields.targetBeneficiaries = targetBeneficiaries;
    if (duration) updateFields.duration = duration;
    if (budget) updateFields.budget = budget;
    if (fundingPartner) updateFields.fundingPartner = fundingPartner;
    if (remarks !== undefined) updateFields.remarks = remarks;
    if (isOngoing !== undefined && typeof isOngoing === "boolean") {
        updateFields.isOngoing = isOngoing;
    }


    const updatedProgram = await Program.findByIdAndUpdate(programId, { $set: updateFields }, { new: true });

    if (!updatedProgram) {
        throw new ApiError(404, "Program not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedProgram, "Program updated successfully"));
});


// Delete a program
const deleteProgram = asyncHandler(async (req, res) => {
    const { programId } = req.params;

    const deletedProgram = await Program.findByIdAndDelete(programId);
    if (!deletedProgram) {
        throw new ApiError(404, "Program not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Program deleted successfully"));
});

export {
    getAllPrograms,
    getPresentPrograms,
    getPastPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
};