import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Useres from '../models/useres.js';
import dotenv from 'dotenv';
dotenv.config();


export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await Useres.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exist." });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." })
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await Useres.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "1hr" });
        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' })
    }
}
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Useres.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' })
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await Useres.find().select('-password')
        res.json(users)
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
};

export const deleteUser = async (req, res) => {
    try {
        await Useres.findByIdAndDelete(req.params.id)
        res.json({ msg: "Deleted Success!" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
};

