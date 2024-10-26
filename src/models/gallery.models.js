import mongoose, {Schema} from "mongoose"

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        imageUrl: {
            main: {
                type: String,
                required: true,
            },
            altText: {
                type: String,
                default: "Gallery Image"
            }
        },
        category: {
            type: String,
            enum: ['Trainings', 'Support', 'Activities', 'IRCH', 'Relive']
        },
        metadata: {
            size: {
                type: Number
            },
            dimensions: {
                width: {type: Number},
                height: {type: Number}
            },
            uploadedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    },
    {timestamps: true}
)

export const Gallery = mongoose.model('Gallery', gallerySchema)