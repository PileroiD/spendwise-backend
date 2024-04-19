import mongoose from "mongoose";
import validator from "validator";

const AccountSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: false,
            default: 0,
        },
        initialAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        image_url: {
            type: String,
            required: true,
            validate: {
                validator: validator.isURL,
                message: "Invalid type of image, must be a URL",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        records: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Record",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Account", AccountSchema);
