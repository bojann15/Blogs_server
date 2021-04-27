import PostMessagess from '../models/postMessagess.js';
import mongoose from 'mongoose';
export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessagess.find({ isApproved: true });
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
}
export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id: ${id}`);
        const post = await PostMessagess.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    };
};
export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessagess({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });

    }
};
export const updatePost = async (req, res) => {
    const { title, message, selectedFile, creator, tags } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id: ${id}`);
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    await PostMessagess.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
}
export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    await PostMessagess.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully." });
}
export const approvedPost = async (req, res) => {
    const post = req.body;
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id: ${id}`);
        const updatedPost = await PostMessagess.findByIdAndUpdate(id, { ...post, id }, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
export const getPostsAdmin = async (req, res) => {
    try {
        const postMessages = await PostMessagess.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    };
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const post = await PostMessagess.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    };
    const updatedPost = await PostMessagess.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
};
