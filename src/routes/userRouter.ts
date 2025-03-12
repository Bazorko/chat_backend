import express from "express";
import FindUser from "../middleware/FindUser";
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
        if(user) httpResponse(res, 400, {}, "This account already exists.");
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error creating your account.");
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
        const rawData = user?.toObject();
        console.log(rawData);
        httpResponse(res, 201, { ...rawData }, "Account created.");
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error creating your account.");
    }
});

//Signin
userRouter.post("/signin", async (req, res) => {
    const { email } = req.body;
    try {
        FindUser(email, res);
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error searching for your account.");
    }
});

//Add Contact
userRouter.post("/contact", async (req, res) => {
    const { username, contact } = req.body;
    try {
        const user = await Users.findOne({ username });
        const newContact = await Users.findOne({ contact });
        if(!newContact) httpResponse(res, 500, {}, "User does not exist.")
        else if(newContact) {
            console.log(user);
            //httpResponse(res, 200, { _id: newContact._id, username: newContact.username }, "Added Contact");
            res.status(500);
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error searching for your account.");
    }
});

export default userRouter;