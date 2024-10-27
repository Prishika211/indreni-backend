import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Admin} from "../models/admin.models.js"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const generateAcessandRefreshToken = async (adminId) => {
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
const registerUser = asyncHandler (async (req, res) => {
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
        if (email !== ADMIN_EMAIL) {
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
        next(error);
    }
})

// Admin Login to generate tokens
const loginAdmin = asyncHandler(async (req, req, next) => {
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
                400,
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

        const {accessToken, refreshToken} = await generateAcessandRefreshToken (
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
        next (error);
    }
})



export {registerUser, loginAdmin}