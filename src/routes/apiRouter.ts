import express from "express";
import mongoose from "mongoose";
import { httpResponse } from "../middleware/HttpResponse";
import Users from "../schemas/userSchema";
import Messages from "../schemas/chatSchema";

const apiRouter = express.Router();

//Add contact
apiRouter.post("/contacts", async (req, res) => {
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
apiRouter.delete("/:userId/contacts/:contactId", async (req, res) => {
    const { userId, contactId } = req.params;
    try {
        const user = await Users.findOne({ _id: userId });
        if(user){
            const contactToDeleteId = new mongoose.Types.ObjectId(contactId);
            const filteredInbox = user.inbox.filter(contacts => !contacts._id.equals(contactToDeleteId));
            user.set("inbox", filteredInbox);
            await user.save();
            httpResponse(res, 200, { ...user.toObject() }, "Contact Deleted.")
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "An unexpected error occured. Try again later.");
    }
});


//Download messages
apiRouter.get("/:userId/messages", async (req, res) => {
    const { userId } = req.params;
    const { contactId } = req.query;
    try {
        const messages = await Messages.find({
            $or: [
                { to: { $in: [ userId, contactId ] } },
                { from: { $in: [ userId, contactId ] } }
            ]
        });
        if(messages){
            httpResponse(res, 200, { messages }, "Found messages from you and this recipient.");
        }
    } catch(error) {
        console.log(error);
        httpResponse(res, 200, {}, "An error occured trying to find your messages with this person.");
    }
});

export default apiRouter;