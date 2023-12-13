import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user: { type: String, required: true, lowercase: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
