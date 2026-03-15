import userModel from "../models/userModel.mjs";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import config from "../../config.mjs";
import uploadFile from "../aws/uploadFile.mjs";
const registerUser = async (req, res) => {
    try {
        let { fname, lname, email, phone, password, address } = req.body;
        if (address) {
            try {
                address = JSON.parse(address);
            } catch (err) {
                return res.status(400).send({ status: false, message: "Address must be a valid JSON object" });
            }
        }
        console.log(fname, lname, email, phone, password, address);
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send({ message: "failed", error: "Profile picture is required" });
        }
        const profileImage = await uploadFile(files[0]);
        console.log("Profile Image URL:", profileImage);
        if (!profileImage) {
            return res.status(500).send({ message: "failed", error: "Failed to upload profile picture" });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        // Check for duplicate user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: false, message: "failed", error: "Email already exists" });
        }
        // Create new user
        const newUser = await userModel.create({ fname, lname, email, profileImage, phone, password, address });
        return res.status(201).send({ "status": true, message: "User created successfully", data: newUser });
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ message: "failed", error: error.message });
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ message: "failed", error: error.message });
        } else {
            return res.status(500).send({ message: "failed", error: "Internal Server Error" });
        }
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "failed", error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "failed", error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, config.secretToken, { expiresIn: '24h' });
        if (!token) {
            return res.status(500).send({ message: "failed", error: "Internal Server Error" });
        }
        res.setHeader("Authorization", `Bearer ${token}`);
        return res.status(200).send({ status: true, message: "User login successful", data: { userId: user._id, token } });
    } catch (error) {
        return res.status(500).send({ message: "failed", error: "Internal Server Error" });
    }
}

const getProfile = async (req, res) => {
    try {
        let { userId } = req.params;
        let profile = await userModel.findById(userId);
        if(!profile){
            return res.status(400).send({status: false, message: "Failed", error:"Profile not found"})
        }
        return res.status(200).send({ status: true, message: "User Profile details", data: profile });
    } catch (error) {
        return res.status(500).send({ status: false, message: "failed", error: error.message });
    }
}

let updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const user = await userModel.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).send({status:false, message: "user not found", error: error.message });
        }
        return res.status(200).send({status:true, message: "user profile updated", data: user });
    } catch (error) {
        return res.status(500).send({status:false, message: "failed", error: error.message });
    }
}
export { registerUser, login, getProfile, updateProfile };