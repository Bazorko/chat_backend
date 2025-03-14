import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./utils/cors_options";
import userRouter from "./routes/userRouter";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`));