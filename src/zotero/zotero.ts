import { callZoteroAPI } from "./fetchZotero.js";
import { Item } from "../types/zotero/Item.ts";
import { PaperStore } from "../index.ts";
import { Paper } from "../types/Papers.ts";
import { Collection } from "../types/zotero/Collection.ts";
import { downloadNextcloud } from "../downloadNextcloud.ts";

export interface ZoteroTree {
    collection: Collection;
    childs?: ZoteroTree[];
    items: TreeItem[];
}
type TreeItem = { item: Item; childs: TreeItem[] };
export const syncZotero = async () => {
    // const toplevelCollections = (
    //     await callZoteroAPI<Collection[]>("/collections/top")
    // ).data;
    // const tree: ZoteroTree[] = [];

    // for (let i = 0; i < toplevelCollections.length; i++) {
    //     const c = toplevelCollections[i];
    //     tree.push(await populateCollection(c));
    // }

    // PaperStore.set(tree);

    const tree = PaperStore.get();
    const documents = getDocumentList(tree, "", "");
    downloadNextcloud(documents);
    //downloadNextcloud();
};
export type Document = {
    path: string;
    name: string;
    key: string;
    keyPath: string;
};
const getDocumentList = (
    trees: ZoteroTree[],
    path: string,
    keyPath: string
): Document[] => {
    const documents: Document[] = [];

    trees.forEach((tree) => {
        tree.items.forEach((item) => {
            documents.push(
                ...getDocumentListItem(
                    item,
                    path + "/" + tree.collection.data.name,
                    keyPath + "/" + tree.collection.key
                )
            );
        });

        if (tree.childs) {
            documents.push(
                ...getDocumentList(
                    tree.childs,
                    path + "/" + tree.collection.data.name,
                    keyPath + "/" + tree.collection.key
                )
            );
        }
    });

    return documents;
};
const getDocumentListItem = (
    item: TreeItem,
    path: string,
    keyPath: string
): Document[] => {
    const documents: Document[] = [];

    if (item.item.data.contentType?.includes("pdf")) {
        documents.push({
            path: path + "/" + item.item.data.filename,
            keyPath: keyPath + "/" + item.item.key,
            key: item.item.key,
            name: item.item.data.filename,
        });
    }
    item.childs.forEach((child) => {
        let newDocs = getDocumentListItem(
            child,
            path + "/" + item.item.data.title,
            keyPath + "/" + item.item.key
        );
        if (newDocs.length <= 1)
            newDocs = getDocumentListItem(
                child,
                path,
                keyPath + "/" + item.item.key
            );

        documents.push(...newDocs);
    });

    return documents;
};
const limit = 30;
const populateCollection = async (
    collection: Collection
): Promise<ZoteroTree> => {
    const numChilds = collection.meta.numCollections;
    const numItems = collection.meta.numItems;

    const mappedChilds: ZoteroTree[] = [];
    const items: TreeItem[] = [];

    if (numChilds > 0) {
        let counter = 0;

        while (counter < numChilds) {
            const subcollections = (
                await callZoteroAPI<Collection[]>(
                    `/collections/${collection.key}/collections?limit=${limit}&start=${counter}`
                )
            ).data;

            for (let i = 0; i < subcollections.length; i++) {
                const element = subcollections[i];
                mappedChilds.push(await populateCollection(element));
            }
            counter += limit;
        }
    }
    if (numItems > 0) {
        let counter = 0;

        while (counter < numItems) {
            const currentItems = (
                await callZoteroAPI<Item[]>(
                    `/collections/${collection.key}/items/top?limit=${limit}&start=${counter}`
                )
            ).data;
            for (let i = 0; i < currentItems.length; i++) {
                const element = currentItems[i];
                items.push(await populateItem(element));
            }

            counter += limit;
        }
    }

    return { collection, items: items, childs: mappedChilds };
};
const populateItem = async (item: Item): Promise<TreeItem> => {
    const numItems = item.meta.numChildren;
    const childs: TreeItem[] = [];

    if (numItems > 0) {
        let counter = 0;

        while (counter < numItems) {
            const currentItems = (
                await callZoteroAPI<Item[]>(
                    `items/${item.key}/children?limit=${limit}&start=${counter}`
                )
            ).data;
            for (let i = 0; i < currentItems.length; i++) {
                const element = currentItems[i];
                childs.push(await populateItem(element));
            }

            counter += limit;
        }
    }
    return { item: item, childs: childs };
};
