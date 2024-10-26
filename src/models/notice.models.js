import mongoose, {Schema} from "mongoose"

const noticeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['Vacancy', 'Update', 'Annoucement', 'Notice'],
            required: true
        },
        attachement: {
            type: String,
            trim: true,
            default: null
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps: true}
)

export const Notice = mongoose.model("Notice", noticeSchema)