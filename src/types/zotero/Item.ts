export interface Item {
    key: string;
    version: number;
    library: Library;
    links: ItemLinks;
    meta: Meta;
    data: Data;
}

export interface Data {
    key: string;
    version: number;
    itemType: string;
    linkMode: string;
    title: string;
    accessDate: string;
    url: string;
    note: string;
    contentType?: string;
    charset: string;
    filename: string;
    md5: string;
    mtime: number;
    tags: any[];
    collections: string[];
    relations: Relations;
    dateAdded: Date;
    dateModified: Date;
}

export interface Relations {}

export interface Library {
    type: string;
    id: number;
    name: string;
    links: LibraryLinks;
}

export interface LibraryLinks {
    alternate: Alternate;
}

export interface Alternate {
    href: string;
    type: string;
}

export interface ItemLinks {
    self: Alternate;
    alternate: Alternate;
}

export interface Meta {
    numChildren: number;
}
