import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import connectDB from "./utils/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./utils/cors_options";
import apiRouter from "./routes/apiRouter";
import userRouter from "./routes/userRouter";
import Messages from "./schemas/chatSchema";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/user", userRouter);
app.use("/api", apiRouter);

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    //Join room
    let roomNameToEmitTo = "";
    socket.on("join room", (roomName) => {
        socket.join(roomName);
        roomNameToEmitTo = roomName
    });
    //Message handling
    socket.on("send message", async ({ to, from, content }, callback) => {
        const newMessage = await Messages.create({ to, from, content});
        io.to(roomNameToEmitTo).emit("return message", newMessage);
        callback();
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(process.env.PORT, () => console.log(`Socket.io server listening on port ${ process.env.PORT }`));