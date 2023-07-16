import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { syncZotero } from "./zotero.ts";
import { createClient } from "webdav";
import { exit } from "process";

dotenv.config();
if (
    !process.env.WEBDAV_URL ||
    !process.env.WEBDAV_USER ||
    !process.env.WEBDAV_PASSWORD
) {
    console.log(
        `Something was not Provided: WEBDAV_URL:${process.env.WEBDAV_URL}, WEBDAV_USER:${process.env.WEBDAV_USER}, WEBDAV_PASSWORD:${process.env.WEBDAV_PASSWORD}`
    );

    exit(1);
}
export const webdav = createClient(process.env.WEBDAV_URL ?? "", {
    username: process.env.WEBDAV_USER,
    password: process.env.WEBDAV_PASSWORD,
});

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

syncZotero();
