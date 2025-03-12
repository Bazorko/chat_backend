"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponse = void 0;
const httpResponse = (res, errorCode, data, message) => {
    return res.status(errorCode).json({ data, message });
};
exports.httpResponse = httpResponse;
