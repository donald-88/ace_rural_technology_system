import mongoose from "mongoose";

const teamMembersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [20, "Name cannot exceed 20 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, "Email must be at least 3 characters"],
        maxlength: [20, "Email cannot exceed 20 characters"],
        validate: {
            validator: function (v: string) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        minlength: [6, "Phone number must be at least 6 characters"],
        maxlength: [20, "Phone number cannot exceed 20 characters"],
        validate: {
            validator: function (v: string) {
                return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(v);
            },
            message: "Please enter a valid phone number"
        }
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        default: "ADMIN",
        uppercase: true,
        enum: {
            values: ["ADMIN", "USER"],
            message: "{VALUE} is not a valid role"
        }
    }
}, {
    timestamps: true
});

// Export the model with proper type checking
export const TeamMembers = mongoose.models.TeamMembers || mongoose.model("TeamMembers", teamMembersSchema);