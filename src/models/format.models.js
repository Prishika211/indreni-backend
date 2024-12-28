import mongoose, {Schema} from "mongoose"

const formatSchema = new Schema(
    {
        title: {
            type: String,
            required:true,
            trim: true,
        },
        description: {
            type: String,
        },
        formatUrls: {
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

export const Format = mongoose.model("Formats", formatSchema);