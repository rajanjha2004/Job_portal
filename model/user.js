import mongoose from "mongoose"
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { select } from "async";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"]
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
            validate: validator.isEmail,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password length is less than 6"],
            select: true

        },
        location: {
            type: String,
            default: "India"
        },
    },

    {
        timestamps: true
    }

);



userSchema.pre('save', async function () {
    if (!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch;
};


userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
};




export default mongoose.model('user', userSchema);