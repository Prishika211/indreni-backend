import mongoose, {Schema} from "mongoose"

const publicationSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: true
        },
        publicationUrls: {
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

export const Publication = mongoose.model("Publications", publicationSchema);