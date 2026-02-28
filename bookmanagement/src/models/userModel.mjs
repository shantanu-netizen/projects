import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is mandatory'],
        enum: {
            values: ['Mr', 'Mrs', 'Miss'],
            message: 'Title must be either Mr, Mrs, or Miss'
        },
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is mandatory'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is mandatory'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [15, 'Password cannot exceed 15 characters']
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        pincode: { type: String, trim: true }
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;