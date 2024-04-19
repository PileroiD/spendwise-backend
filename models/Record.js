import mongoose from "mongoose";
import validator from "validator";

const RecordSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        account_name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: false,
        },
        image_url: {
            type: String,
            required: false,
            validate: {
                validator: validator.isURL,
                message: "Invalid type of image, must be a URL",
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Record", RecordSchema);
