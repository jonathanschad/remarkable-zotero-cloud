import { webdav } from "./index.ts";

export const downloadNextcloud = async () => {
    const directoryItems = await webdav.getDirectoryContents("/zotero");
    //console.log(directoryItems);
};
