import mongoose, {Schema} from "mongoose"

const storySchema = new Schema (
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrls: [
            {
                type: String,
                required: true
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Uesr',
            required: true
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        },
        tags: [{type: String}] // Optional tags to categorize stories
    },
    {timestamps: true}
)

export const Story = mongoose.model("Story", storySchema)