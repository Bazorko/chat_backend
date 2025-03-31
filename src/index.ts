import express from "express";
import connectDB from "./utils/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./utils/cors_options";
import userRouter from "./routes/userRouter";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/user", userRouter);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`));