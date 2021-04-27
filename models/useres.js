import mongoose from 'mongoose';

const useresSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
    role: { type: Number, default: 0 }
})
export default mongoose.model('Useres', useresSchema);