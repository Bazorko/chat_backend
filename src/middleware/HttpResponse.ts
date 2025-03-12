import { Response } from "express";

export const httpResponse = (res: Response, errorCode: number, data: {}, message: string) => {
    return res.status(errorCode).json({ data, message });
}