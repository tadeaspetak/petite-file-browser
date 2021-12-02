import cookieParser from "cookie-parser";
import express from "express";
import fs from "fs";
import path from "path";

import { api } from "./api";

const app = express();
// app.disable('x-powered-by') TODO
app.use(express.json());
app.use(cookieParser(""));
app.use("/api", api);

const client = path.resolve(__dirname, "../build");
if (fs.existsSync(client)) app.use(express.static(client));

export { app };
