import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ZoteroAccount } from "../types/zotero/Account.ts";

const ZOTERO_BASE_URL = "https://api.zotero.org";
export enum FethMethodes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
}
export const callZoteroAPI = async <T = unknown>(
    path: string,
    methode: string = FethMethodes.GET,
    body?: unknown
): Promise<AxiosResponse<T, any>> => {
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
        await loginZotero();
    }
    const user = userApikey.get(apiKey);
    if (!user) {
        throw new Error("Could not find USER for API key: " + apiKey);
    }
    path = `${ZOTERO_BASE_URL}/users/${user.userID}/${path}`;
    switch (methode) {
        case FethMethodes.GET:
            return axios.get<T>(path, options);
        case FethMethodes.POST:
            return axios.post<T>(path, body, options);
        case FethMethodes.PUT:
            return axios.put<T>(path, body, options);
        default:
            return axios.get<T>(path, options);
    }
};
const userApikey = new Map<string, ZoteroAccount>();

const loginZotero = async () => {
    if (process.env.ZOTERO_API_KEY) {
        const path = `${ZOTERO_BASE_URL}/keys/current`;
        const options: AxiosRequestConfig = {
            headers: {
                "Zotero-API-Key": process.env.ZOTERO_API_KEY,
            },
        };
        const user = await axios.get<ZoteroAccount>(path, options);
        userApikey.set(process.env.ZOTERO_API_KEY, user.data);
        return user.data;
    } else {
        throw new Error(
            "Could not find USER for API key: " + process.env.ZOTERO_API_KEY
        );
    }
};
