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
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const HttpResponse_1 = require("../middleware/HttpResponse");
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter = express_1.default.Router();
if (process.env.DB_URI) {
    mongoose_1.default.connect(process.env.DB_URI);
}
//Signup
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.body;
    const friendsList = [];
    //Find user
    try {
        const user = yield userSchema_1.default.findOne({ username });
        if (user)
            (0, HttpResponse_1.httpResponse)(res, 400, "This account already exists.");
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, "There was an error creating your account.");
    }
    //Create user
    try {
        const newUser = yield userSchema_1.default.create({
            username,
            email,
            friendsList
        });
        yield newUser.save();
        const user = yield userSchema_1.default.findOne({ email });
        res.status(201).json(Object.assign({}, user));
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, "There was an error creating your account.");
    }
}));
//Signin
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield userSchema_1.default.findOne({ email });
        res.status(200).json(Object.assign({}, user));
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, "There was an error searching for your account.");
    }
}));
exports.default = userRouter;
