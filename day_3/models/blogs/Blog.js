import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    id: { type: Number, default: 0 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false },
    likes: [{ user_name: { type: String, default: 'Unknown' }, timestamps: { type: Date, default: Date.now } }],
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
}, { timestamps: true });

export const Blog = mongoose.model('Blog', BlogSchema);
