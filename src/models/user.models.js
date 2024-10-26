import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            roleType: {
                type: String, enum:['admin', 'user', 'editor', 'viewer'],
                default: 'admin'
            },
            permissions: [
                {
                    type: String,
                    enum: ['READ', 'WRITE', 'DELETE', 'UPDATE']
                }
            ],
            lastUpdatedBy: {
                type: Schema.Types.ObjectId, 
                ref: 'User'
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken : {
            type: String,
        }
    }, 
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);