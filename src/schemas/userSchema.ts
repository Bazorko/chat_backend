import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    friendsList: [{
        id: String,
    }],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: Date,
})

const Users = model("User", userSchema);

export default Users;