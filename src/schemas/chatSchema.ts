import mongoose from "mongoose";
import Users from "./userSchema";

const { Schema, model } = mongoose;

/*
const chatsSchema = new Schema({
    id: Schema.ObjectId,
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true
        }
    ],
    ref: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }
});

export const Chats = model('Chats', chatsSchema);
*/

const messageSchema = new Schema({
    to: { type: String, required: true },
    from: { type: String, required: true },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

const Messages = model('Message', messageSchema);

export default Messages;