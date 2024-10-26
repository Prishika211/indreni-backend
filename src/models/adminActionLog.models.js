import mongoose, {Schema} from "mongoose"

const adminActionLogSchema = new Schema(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        action: {
            type: String,
            required: true
        },
        modelAffected: {
            type: String,
            required: true
        },
        documentId: {
            type: Schema.Types.ObjectId
        }

    },
    {timestamps: true}
)

export const AdminAction = mongoose.model("AdminAction", 
    adminActionLogSchema
)