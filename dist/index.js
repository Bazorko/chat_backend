"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./utils/db"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_options_1 = __importDefault(require("./utils/cors_options"));
const apiRouter_1 = __importDefault(require("./routes/apiRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const chatSchema_1 = __importDefault(require("./schemas/chatSchema"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['POST']
    }
});
app.use((0, cors_1.default)(cors_options_1.default));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, db_1.default)();
app.use("/user", userRouter_1.default);
app.use("/api", apiRouter_1.default);
io.on("connection", (socket) => {
    console.log(`user: ${socket.id} connected`);
    socket.on("sendMessage", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ to, from, content }, callback) {
        const newMessage = yield chatSchema_1.default.create({ to, from, content });
        yield newMessage.save();
        io.emit("returnMessage", newMessage);
        callback();
    }));
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});
server.listen(process.env.SOCKET_PORT, () => console.log(`Socket.io server listening on port ${process.env.SOCKET_PORT}`));
app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`));
