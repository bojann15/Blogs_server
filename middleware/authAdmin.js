import Useres from '../models/useres.js';

const authAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await Useres.findOne({ _id: req.userId });
        if (user.role !== 1)
            return res.status(500).json({ msg: "Admin resources access denied." })
        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export default authAdmin;