import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    to: { type: String, required: true },
    from: { type: String, required: true },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

export const Message = model('Message', messageSchema);

const chatsSchema = new Schema({
    id: Schema.ObjectId,
    ref: "Message"
});

export const Chats = model('Chats', chatsSchema);