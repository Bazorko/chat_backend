import { Response } from "express";

export const httpResponse = (res: Response, errorCode: number, message: string) => {
    return res.status(errorCode).json({ message });
}