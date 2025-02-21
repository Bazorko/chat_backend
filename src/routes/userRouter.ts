import express from "express";
import Users from "../schemas/userSchema";
import { httpResponse } from "../middleware/HttpResponse";
import mongoose from "mongoose";

const userRouter = express.Router();

if(process.env.DB_URI){
    mongoose.connect(process.env.DB_URI);
}

//Signup
userRouter.post("/signup", async (req, res) => {
    const { username, email } = req.body;
    const friendsList = <{}>[];
    //Find user
    try {
        const user = await Users.findOne({ username });
        if(user) httpResponse(res, 400, "This account already exists.");
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, "There was an error creating your account.");
    }
    //Create user
    try {
        const newUser = await Users.create({
            username,
            email,
            friendsList
        });
        await newUser.save();
        const user = await Users.findOne({ email });
        res.status(201).json({ ...user });
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, "There was an error creating your account.");
    }
});

//Signin
userRouter.post("/signin", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        res.status(200).json({ ...user });
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, "There was an error searching for your account.");
    }
});

export default userRouter;