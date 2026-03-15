import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is mandatory"],
        trim: true
    },
    lname: {
        type: String,
        required: [true, "Last name is mandatory"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    profileImage: {
        type: String,
        required: [true, "Profile image S3 link is mandatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is mandatory"],
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please fill a valid Indian mobile number']
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [100, "Password cannot exceed 100 characters"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ]
    },
    address: {
        shipping: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true }
        },
        billing: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true }
        }
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;