import api from "zotero-api-client";

interface ZoteroAccount {
    key: string;
    userID: number;
    username: string;
    displayName: string;
    access: {
        user: {
            library: boolean;
            files: boolean;
            notes: boolean;
            write: boolean;
        };
    };
}
interface ZoteroLibraryItem {
    key: string;
    version: 25;
    itemType: string;
    title: string;
    creators: unknown[][];
    abstractNote: string;
    websiteTitle: string;
    websiteType: string;
    date: string;
    shortTitle: string;
    url: string;
    accessDate: string;
    language: string;
    rights: string;
    extra: string;
    tags: unknown[];
    collections: string[];
    relations: unknown;
    dateAdded: string;
    dateModified: string;
}
type APIResponse<T> = {
    getResponseType: () => string;
    getData: () => T;
    getLinks: () => unknown;
    getMeta: () => unknown;
    getVersion: () => number;
};
export const syncZotero = async () => {
    if (process.env.ZOTERO_API_KEY) {
        let zotero = api(process.env.ZOTERO_API_KEY).verifyKeyAccess();
        const account = (
            (await zotero.get()) as APIResponse<ZoteroAccount>
        ).getData();
        console.log("account", account);
        zotero = zotero.library("user", account.userID);
        const itemsResponse: APIResponse<ZoteroLibraryItem[]> = await zotero
            .items()
            .get();

        const testItem = itemsResponse.getData()[5];

        const itemsResponse2: APIResponse<ZoteroLibraryItem[]> = await zotero
            .items()
            .attachment()
            .get();

        console.log(itemsResponse2);

        testItem;
    }
};
