import User from "../model/user.model.js";
import Meeting from "../model/meeting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const JwtSecret = "Zoom_jwt_secret";


export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Please Provide Email & Password"})
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Sorry user not exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign(
                {id: user._id , name: user.name ,email: user.email || "user"},
                JwtSecret,
                { expiresIn: "1h" , algorithm: 'HS256'}
            );
            await user.save();
            return res.status(200).json({message: "Login Successfull" ,token})
        }
    } catch (error) {
        return res.status(500).json({message: `somthing went wrong ${error}`})
    }
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "Please Provide"});
    }

    try {
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "Sorry user already exist"})
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password: hashedpassword
        });

        await newUser.save();
        return res.status(200).json({message: "User Created Successfully" , name});

    } catch (error) {
        return res.status(500).json({message: `somthing went wrong ${error}`})
    }
}

export const addToHistory = async (req, res) => {
    const { token, meetingCode } = req.body;
    
    try {
        const user = await User.findOne({token: token});

        const newMeeting = new Meeting({
            user_id: user.name,
            meetingCode
        })
        await newMeeting.save();
        return res.status(200).json({message: "Meeting Added Successfully" , newMeeting});
    }  catch (error) {
        return res.status(500).json({message: `somthing went wrong ${error}`})
    }
}

export const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.name })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}