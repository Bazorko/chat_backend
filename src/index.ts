import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import corsOptions from "./utils/cors_options";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}.`));