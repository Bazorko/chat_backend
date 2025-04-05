import { Response } from "express";
import Users from "../schemas/userSchema";
import { httpResponse } from "./HttpResponse";

const FindUser = async (identifier: string, res: Response) => {
    try {
        const user = await Users.findOne({ email: identifier });
        if(!user) httpResponse(res, 500, {}, "User not found.") 
        else if(user) httpResponse(res, 200, { ...user.toObject() }, "User found.");
    } catch(error) {
        console.log(error);
        httpResponse(res, 500, {}, "An unexpected error occured. Try again later.");
    }
}

export default FindUser;