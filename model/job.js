import mongoose, { isObjectIdOrHexString } from "mongoose"


const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        require: [true, "Company name is Required"]
    },

    position: {
        type: String,
        required: [true, "Job Position is required"],
        maxlength: 100
    },

    status: {
        type: String,
        enum: ["pending", "reject", "interview"],
        default: "pending"
    },

    workType: {
        type: String,
        enum: ["full-time", "part-time", "internship", "Contract-based"],
        default: "full-time"
    },

    worklocation: {
        type: String,
        default: "Mumbai",
        required: [true, "Work Location is required"]
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }


}, { timestamps: true }
)

export default mongoose.model('jobs', jobSchema)