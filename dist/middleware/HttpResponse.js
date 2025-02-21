"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponse = void 0;
const httpResponse = (res, errorCode, message) => {
    return res.status(errorCode).json({ message });
};
exports.httpResponse = httpResponse;
