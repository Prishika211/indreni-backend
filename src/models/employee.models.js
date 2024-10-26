import mongoose, {Schema} from "mongoose";

const employeeSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

export const Employee = mongoose.model("Employee", employeeSchema)