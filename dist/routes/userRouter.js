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
const FindUser_1 = __importDefault(require("../middleware/FindUser"));
const userSchema_1 = __importDefault(require("../schemas/userSchema"));
const HttpResponse_1 = require("../middleware/HttpResponse");
const userRouter = express_1.default.Router();
//Signup
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.body;
    const friendsList = [];
    //Find user
    try {
        const user = yield userSchema_1.default.findOne({ username });
        if (user)
            (0, HttpResponse_1.httpResponse)(res, 400, {}, "This account already exists.");
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, {}, "There was an error creating your account.");
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
        const rawData = user === null || user === void 0 ? void 0 : user.toObject();
        (0, HttpResponse_1.httpResponse)(res, 201, Object.assign({}, rawData), "Account created.");
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, {}, "There was an error creating your account.");
    }
}));
//Signin
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        (0, FindUser_1.default)(email, res);
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, {}, "There was an error searching for your account.");
    }
}));
userRouter.post("/contacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, contact } = req.body;
    try {
        const user = yield userSchema_1.default.findOne({ username: username });
        console.log(user);
        const newContact = yield userSchema_1.default.findOne({ username: contact });
        console.log(newContact);
        if (user === null || user === void 0 ? void 0 : user.inbox.some(obj => obj.username == (newContact === null || newContact === void 0 ? void 0 : newContact.username))) {
            (0, HttpResponse_1.httpResponse)(res, 500, {}, "User already added.");
        }
        else if (!newContact)
            (0, HttpResponse_1.httpResponse)(res, 500, {}, "User does not exist.");
        else if (newContact) {
            user === null || user === void 0 ? void 0 : user.inbox.push({ _id: newContact._id, username: newContact.username });
            user === null || user === void 0 ? void 0 : user.save();
            (0, HttpResponse_1.httpResponse)(res, 200, Object.assign({}, user === null || user === void 0 ? void 0 : user.toObject()), "Added Contact");
        }
    }
    catch (error) {
        console.log(error);
        (0, HttpResponse_1.httpResponse)(res, 500, {}, "There was an error searching for your account.");
    }
}));
exports.default = userRouter;
