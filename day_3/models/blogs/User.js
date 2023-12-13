import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { Type: String, required: true },
    email: { Type: String, required: true },
    password: { Type: String, required: true },
    profile: { Type: String, default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" },
    bio: { Type: String },
    birthday: { Type: String },
    gender: { Type: String },
    first_name: { Type: String, required: true },
    last_name: { Type: String, required: true },
    blogs: [{ Type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    profile_urls: [{
        link_name: { Type: String },
        url: { Type: String },
    }],
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);