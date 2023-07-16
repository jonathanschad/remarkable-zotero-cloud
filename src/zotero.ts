import apiDefault from "zotero-api-client";
import { webdav } from "./index.ts";
import { downloadNextcloud } from "./downloadNextcloud.ts";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
const api = apiDefault.default;

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
        console.log(api);
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
        console.log(testItem);
        callZoteroAPI("test");
        //downloadNextcloud();
    }
};

enum FethMethodes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
}
const callZoteroAPI = async <T = unknown>(
    path: string,
    methode: string = FethMethodes.GET,
    body?: unknown
): Promise<T> => {
    const apiKey = process.env.ZOTERO_API_KEY as string;
    const options: AxiosRequestConfig = {
        headers: {
            "Zotero-API-Key": process.env.ZOTERO_API_KEY,
        },
    };
    while (path.startsWith("/")) {
        path = path.substring(1);
    }
    if (!userApikey.has(apiKey)) {
        loginZotero();
    }
    const user = userApikey.get(apiKey);
    if (!user) {
        throw new Error("Could not find USER for API key: " + apiKey);
    }
    path = `https://api.zotero.org/users/${user}/${path}`;
    switch (methode) {
        case FethMethodes.GET:
            return axios.get(path, options);
        case FethMethodes.POST:
            return axios.post(path, body, options);
        case FethMethodes.PUT:
            return axios.put(path, body, options);
        default:
            return axios.get(path, options);
    }
};
const userApikey = new Map<string, ZoteroAccount>();

const loginZotero = async () => {
    if (process.env.ZOTERO_API_KEY) {
        const path = `https://api.zotero.org/keys/${process.env.ZOTERO_API_KEY}`;
        const user = await axios.get<ZoteroAccount>(path);
        userApikey.set(process.env.ZOTERO_API_KEY, user.data);
        return user.data;
    } else {
        throw new Error(
            "Could not find USER for API key: " + process.env.ZOTERO_API_KEY
        );
    }
};
