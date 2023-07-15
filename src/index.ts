import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { syncZotero } from "./zotero";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
syncZotero();
