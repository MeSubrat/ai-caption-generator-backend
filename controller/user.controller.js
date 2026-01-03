import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt';

const registerUser = async (req, res) => {
    const { fullname, email, password, avatar } = req.body;
    try {
        // Check if user already exists
        const isUserPresent = await UserModel.findOne({ email });
        if (isUserPresent) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            fullname,
            email,
            password: hashedPassword
        })
        await newUser.save;
        res.status(200).json({ message: "User registered successfully.", user: newUser })
    } catch (error) {
        res.status(500).json({ message: "Error while registering User." });
    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials." });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials." });
    }

    return res.status(200).json({ message: "Login Successful", user: existingUser });
}

export { registerUser, loginUser };