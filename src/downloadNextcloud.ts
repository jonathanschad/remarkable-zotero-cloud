import { BufferLike, FileStat } from "webdav";
import { webdav } from "./index.ts";
import { Document } from "./zotero/zotero.ts";
import { unlinkSync, writeFileSync } from "fs";
import path from "path";
import AdmZip from "adm-zip";
const __dirname = "./data/documents/";
export const downloadNextcloud = async (documents: Document[]) => {
    const directoryItems = (await webdav.getDirectoryContents(
        "/zotero"
    )) as FileStat[];

    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];

        const serverDoc = directoryItems.find(
            (d) => d.basename.includes(doc.key) && d.basename.includes(".zip")
        );
        if (serverDoc) {
            console.log(`Downloading Document ${i + 1}/${documents.length}`);

            const buff: Buffer = (await webdav.getFileContents(
                serverDoc.filename
            )) as Buffer;

            const tmpFilePath = path.join(__dirname, serverDoc.basename);
            writeFileSync(tmpFilePath, buff);

            const zip = new AdmZip(tmpFilePath);
            const extractPath = path.join(__dirname);
            zip.extractAllTo(/*target path*/ extractPath, /*overwrite*/ true);
            unlinkSync(tmpFilePath);
        }
    }
};
