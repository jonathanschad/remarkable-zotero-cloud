import { readFileSync, writeFile, writeFileSync } from "fs";

export class Store<T = unknown> {
    item: T;
    path: string;
    constructor(dataPath: string) {
        this.path = dataPath;
        let value: T = {} as T;
        try {
            value = JSON.parse(readFileSync(dataPath, "utf8")) as T;
        } catch {}
        this.item = value;
    }

    get() {
        return this.item;
    }
    set(data: T) {
        this.item = data;

        writeFile(this.path, JSON.stringify(data), (e) => {
            console.log("File Written", e);
        });
    }
}
