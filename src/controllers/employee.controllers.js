import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Employee} from "../models/employee.models.js";

const getEmployees = asyncHandler (async (req, res) => {
    const employees = await Employee.find();
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            employees,
            "Employees fetched successfully"
        )
    )
})

const createEmployee = asyncHandler(async (req, res) => {
    const {name, position, category} =req.body;

    try {
        if (!req.file) {
            throw new ApiError(400, "No image uploaded");
          }
 
        const photo = req.file.path;

        const newEmployee = await Employee.create(
            {
                name, position, category, photoUrl: photo
            }
        );
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                newEmployee, 
                "Employee created successfully"
            ))
    } catch (error) {
        throw new ApiError(
            500,
            error.message || "Employee couldn't be created"
        )
    }
})

const updateEmployee = asyncHandler(async (req, res) => {
    const {employeeId} = req.params;
    const {name, position, category} = req.body;

    const updateFields = {};
    if(name) updateFields.name = name;
    if(position) updateFields.position = position;
    if(category) updateFields.category = category;

    if (!req.file) {
        throw new ApiError(400, "No image uploaded");
      }
    const photo = await req.file.path;
    updateFields.photoUrl = photo;

    const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        {
            $set: updateFields   
        },
        {
            new: true
        }
    )

    if(!updatedEmployee){
        throw new ApiError(
            404,
            "Employee not found"
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            updatedEmployee,
            "Employee updated successfully"
        )
    )
})

const deleteEmployee = asyncHandler(async (req, res) => {
    const {employeeId} = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if(!deletedEmployee){
        throw new ApiError(
            404,
            "Employee not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Employee deleted successfully"
        )
    )
})

export {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
}