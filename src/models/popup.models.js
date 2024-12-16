import mongoose, {Schema} from "mongoose";

const popupSchema = new Schema({
  imageUrl: {
    type: String, // Image URL on Cloudinary
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Popup = mongoose.model("Popup", popupSchema);