import express from "express";
import Users from "../schemas/userSchema";
import mongoose from "mongoose";

const userRouter = express.Router();

if(process.env.DB_URI){
    mongoose.connect(process.env.DB_URI);
}

userRouter.post("/signup", async (req, res) => {
    const { username, email } = req.body;
    const friendsList = <{}>[];
    //Find user
    //Create user
    try {
        const newUser = await Users.create({
            username,
            email,
            friendsList
        });
        await newUser.save();
        res.status(201).json({ username, email, friendsList });
    } catch(error) {
        console.log(error);
        res.status(500).json({ errorMessage: "There was an error craeting your account." });
    }
});

export default userRouter;