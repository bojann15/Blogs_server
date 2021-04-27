import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPosts, createPost, deletePost, updatePost, likePost, getPost, approvedPost, getPostsAdmin } from './services/posts.js';
import { signin, signup, getAllUsers, deleteUser } from './services/user.js';
import auth from './middleware/auth.js';
import authAdmin from './middleware/authAdmin.js';

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.get("/posts", getPosts);
app.get("/posts/:id", getPost);
app.post("/posts", auth, createPost);
app.put("/posts/:id", auth, updatePost);
app.put("/posts/:id/likePost", auth, likePost);
app.delete("/posts/:id", auth, deletePost);
app.post("/user/signin", signin);
app.post("/user/signup", signup);
app.get("/users/", auth, authAdmin, getAllUsers);
app.delete("/users/:id", auth, authAdmin, deleteUser)
app.delete("/admin/posts/:id", auth, authAdmin, deletePost);
app.put("/admin/posts/:id", auth, authAdmin, approvedPost);
app.get("/admin/posts/:id", auth, authAdmin, getPost);
app.get("/admin/posts", auth, authAdmin, getPostsAdmin);


const PORT = process.env.PORT;
mongoose.connect(String(process.env.CONNECTION_URL), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message))
mongoose.set('useFindAndModify', false);