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
    cors: {
        origin: 'http://localhost:5173',
        methods: ['POST']
    }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/user", userRouter);
app.use("/api", apiRouter);

io.on("connection", (socket) => {
    console.log(`user: ${socket.id} connected`);
    socket.on("sendMessage", async ({ to, from, content }, callback) => {
            const newMessage = await Messages.create({ to, from, content});
            await newMessage.save();
        io.emit("returnMessage", newMessage);

        callback();
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(process.env.SOCKET_PORT, () => console.log(`Socket.io server listening on port ${ process.env.SOCKET_PORT }`));

app.listen(process.env.PORT, () => console.log(`Server listening on port ${ process.env.PORT }.`));