import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Slider} from "../models/slider.models.js";
import { owner } from "../constants.js";


const addSliderImage = asyncHandler(async(req, res)=> {
    const {displayOrder} = req.body;


    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
      }
    const image = await req.file.path;


    const slider = await Slider.create({
        imageUrl: image,
        displayOrder: displayOrder || 0,
        owner: owner
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                slider,
                "Slider image added successfully"
            )
        );
});

const removeSliderImage = asyncHandler(async(req, res)=> {
    const {sliderId} = req.params;

    const slider = await Slider.findById(sliderId);

    if(!slider){
        throw new ApiError(404, "Slider image not found");
    }

    await Slider.findByIdAndDelete(sliderId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Slider image removed successfully"
            )
        );
});

const getAllSliderImages = asyncHandler(async (req, res)=> {
    const sliders = await Slider.find()
    .sort({displayOrder:1});


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                sliders,
                "Slider images fetched successfully"
            )
        );
});

const updateDisplayOrder = asyncHandler(async(req, res)=> {
    const {sliderId} = req.params;
    const {displayOrder} = req.body;

    if(typeof displayOrder !== "number"){
        throw new ApiError(400, "Display order must be a number");
    }

    const updatedSlider = await Slider.findByIdAndUpdate(
        sliderId,
        {
            $set: {displayOrder}
        },
        {new: true}
    )

    if(!updatedSlider){
        throw new ApiError(404, "Slider image not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedSlider,
                "Display order updated successfully"
            )
        )
});

export {
    addSliderImage,
    removeSliderImage,
    getAllSliderImages,
    updateDisplayOrder
};

