import User from "../model/user.model.js";
import Meeting from "../model/meeting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../utils/validationSchema.js";
import dotenv from "dotenv";

const JwtSecret = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email || "user" },
    JwtSecret,
    { expiresIn: "1h", algorithm: "HS256" }
  );
};

export const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Sorry user not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        const token = generateToken(user);
        return res.status(200).json({ message: "Login Successfull", token });
    }

    return res.status(400).json({ message: "Invalid Credentials" });
};

export const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Sorry user already exist" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedpassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "User Created Successfully", name });
};

export const addToHistory = async (req, res) => {
    const {meetingCode } = req.body;

    const user = req.user;



    const newMeeting = new Meeting({
        user_id: user.name,
        meetingCode,
    });

    await newMeeting.save();
    return res.status(200).json({ message: "Meeting Added Successfully", newMeeting });
};

export const getUserHistory = async (req, res) => {
    const user = req.user;

    const meetings = await Meeting.find({ user_id: user.name });
    res.json(meetings);
};
