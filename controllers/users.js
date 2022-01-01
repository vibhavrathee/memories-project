import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

import User from "../models/user.js"
export const signin = async(req, res) => {
    // console.log("SignIn called")
    
    const {email, password} = req.body;
    // console.log(email, password);
    try {
        const temp = await User.find();
        // console.log(temp);
        const existingUser = await User.findOne({email})
        if(!existingUser) {
            return res.status(404).json({message: 'User does not exist'})
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'});
        res.status(200).json({result: existingUser, token});

    } catch(e) {
        res.status(500).json({message: "Something went wrong!"});
    }
}

export const signup = async(req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        if(password !== confirmPassword) {
            return res.status(400).json({message: "Passwords do not match"});
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await User.create({email, password: hashPassword, name: `${firstName} ${lastName}`})
        const token = jwt.sign({ email: result.email, id: result._id}, 'test', {expiresIn: '1h'});
        return res.status(200).json({result, token}); 
    } catch(e) {
        res.status(500).json({message: "Something went wrong!"});
    }
}
// export const signin = () => {
// 
// }
// export const signup = () => {
    
// }