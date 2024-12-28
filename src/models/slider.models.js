import mongoose, {Schema} from "mongoose"

const sliderSchema = new Schema(
    {
        imageUrl: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
        displayOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

export const Slider = mongoose.model("Slider", sliderSchema)