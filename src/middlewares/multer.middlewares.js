import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import pkg from "cloudinary";
import dotenv from "dotenv";
const { v2: cloudinary } = pkg;

// Load environment variables
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => ({
    folder: "gallery-images", // Change folder name as needed
    format: file.mimetype.split("/")[1], // Auto-detect format
    public_id: `${Date.now()}-${file.originalname}`, // Unique file name
    allowed_formats: ["jpg", "jpeg", "png", "pdf"], // Allow images & PDF
  }),
});

// **Modify fileFilter to accept both images and PDFs**
const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") || // Allows images (jpg, png, jpeg)
    file.mimetype === "application/pdf" // Allows PDF files
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter,
});

export default upload;
