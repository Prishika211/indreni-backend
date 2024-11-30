import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Admin} from "../models/admin.models.js"
import jwt from "jsonwebtoken"

const generateAccessandRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({validateBeforeSave: false});

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and acess token"
        )
    }
}

const registerAdmin = asyncHandler (async (req, res) => {
    const {email, fullName, username, password} = req.body;

    if(
        [email, fullName, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(
            400,
            "All fields are required"
        )
    }
    try {
        if (email !== process.env.ADMIN_EMAIL) {
            throw new ApiError(
                403,
                "Unauthorized email for registration"
            )
        }

        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin) {
            throw new ApiError(
                400,
                "Admin already registered"
            )
        }

        const newAdmin = await Admin.create({
            fullName,
            email,
            password,
            role: "admin",
            username: username.toLowerCase()
        })

        const createdAdmin = await Admin.findById(newAdmin._id).select(
            "-password -refreshToken"
        )

        if(!createdAdmin){
            throw new ApiError(
                500,
                "Something went wrong while registering the user"
            )
        }

        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdAdmin,
                "Admin registered successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            500,
            "Admin can't be registered"
        )
    }
})

// Admin Login to generate tokens
const loginAdmin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email){
        throw new ApiError(
            400,
            "email is required"
        )
    }
    try {
        const admin = await Admin.findOne({email});

        if (!admin) {
            throw new ApiError(
                404,
                "Invalid email or password"
            )
        }

        const isPasswordValid = await admin.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError (
                401,
                "Invalid user credentials"
            )
        }

        const {accessToken, refreshToken} = await generateAccessandRefreshToken (
            admin._id
        )

        const loggedInAdmin = await Admin.findById(admin._id).select(
            "-password -refreshToken"
        )  

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accessToken,
                    refreshToken
                },
                "Admin logged in successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            500,
            "Admin can't be logged in"
        )
    }
})

const logoutAdmin = asyncHandler(async (req, res) => {
    try {
            await Admin.findByIdAndUpdate(
                req.admin._id, 
                {
                    $unset: {
                        refreshToken: 1
                    }
                },
                {
                    new: true,
                }
            )
        
            const options = {
                httpOnly: true,
                secure: true
            }
        
            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, {}, "Admin logged out successfully"))
    } catch (error) {
        throw new ApiError(
            500,
            "Admin can't be logged out"
        )
    }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

   if(!incomingRefreshToken){
    throw new ApiError(
        401,
        "unauthorized request"
    )
   }


   try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
    const admin = await Admin.findById(decodedToken?._id)
 
    if(!admin){
     throw new ApiError(
         401,
         "Invalid refresh token"
     )
    }
 
    if(incomingRefreshToken !== admin?.refreshToken){
         throw new ApiError(
             401,
             "Refresh token is expired or used"
         )
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(admin._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiResponse(
             200,
             {accessToken, refreshToken: newRefreshToken},
             "Access token refreshed successfully"
         )
     )
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
   }
})



export {registerAdmin , loginAdmin, logoutAdmin, refreshAccessToken}