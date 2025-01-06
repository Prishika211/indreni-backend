import mongoose, {Schema} from "mongoose"

const noticeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String, // URL for the uploaded image
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        }
    },
    {timestamps: true}
)

export const Notice = mongoose.model("Notice", noticeSchema)