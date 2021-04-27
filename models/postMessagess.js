import mongoose from 'mongoose';
const postsSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    id: { type: String },
    createdAt: {
        type: Date,
        default: new Date()
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

const PostMessagess = mongoose.model('PostMessagess', postsSchema);
export default PostMessagess;