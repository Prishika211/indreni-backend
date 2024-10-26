import mongoose, {Schema} from "mongoose";

const programSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        objective: {
            type: String,
            required: true
        },
        targetBeneficiaries: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        fundingPartner: {
            type: String,
            required: true
        },
        remarks: {
            type: String,
            default: ''
        },
        isOngoing: {
            type: Boolean,
            default: false
        },
    },
    {timestamps: true}
)

export const Program = mongoose.model('Program', programSchema);