import express from "express";
import FindUser from "../middleware/FindUser";
import Users from "../schemas/userSchema";
import Messages from "../schemas/chatSchema";
import { httpResponse } from "../middleware/HttpResponse";

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
    const { email } = req.body;
    try {
        FindUser(email, res);
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error searching for your account.");
    }
});


//Add contact
userRouter.post("/contacts", async (req, res) => {
    const { username, contact } = req.body;
    try {
        const user = await Users.findOne({ username });
        const newContact = await Users.findOne({ username: contact });
        if(user?.inbox.some(obj => obj.username == newContact?.username)){
            httpResponse(res, 500, {}, "User already added.");
        }
        else if(!newContact) httpResponse(res, 500, {}, "User does not exist.")
        else if(newContact) {
            user?.inbox.push({ _id: newContact._id, username: newContact.username });
            user?.save();
            httpResponse(res, 200, { ...user?.toObject() }, "Added Contact");
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "There was an error searching for your account.");
    }
});

//Delete contact
userRouter.delete("/contacts", async (req, res) => {
    const { username, userToRemove } = req.body;
    try {
        const user = await Users.findOne({ username });
        if(user){
            const newInbox = user.inbox.filter(contact => contact.username !== userToRemove);
            user.set("inbox", newInbox)
            await user.save();
            httpResponse(res, 200, { ...user.toObject() }, "Contact Deleted.")
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "An unexpected error occured. Try again later.");
    }
});


//Download messages
userRouter.post("/messages", async (req, res) => {
    const { self, contact } = req.body;
    try {
        const messages = await Messages.find({
            $or: [
                { to: { $in: [ self, contact ] } },
                { from: { $in: [ self, contact ] } }
            ]
        });
        if(messages){
            console.log(messages);
            httpResponse(res, 200, { messages }, "Found messages from you and this recipient.");
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 200, {}, "An error occured trying to find your messages with this person.");
    }
});

export default userRouter;