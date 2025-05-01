import express from "express";
import { httpResponse } from "../middleware/HttpResponse";
import FindUser from "../middleware/FindUser";
import Users from "../schemas/userSchema";

const userRouter = express.Router();

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
        httpResponse(res, 201, { ...rawData }, "Account created.");
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error creating your account.");
    }
});

//Signin
userRouter.post("/signin", async (req, res) => {
    try {
        const { identifier } = req.body;
        FindUser(identifier, res);
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error searching for your account.");
    }
});

export default userRouter;