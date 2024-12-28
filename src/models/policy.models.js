import mongoose, {Schema} from "mongoose"

const policySchema = new Schema(
    {
        policyUrls: {
            type: String,
            required: true,
            unique: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },

    },
    {
        timestamps: true
    }
)

export const Policy = mongoose.model("Policies", policySchema);