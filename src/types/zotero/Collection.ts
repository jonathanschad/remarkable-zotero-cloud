export interface Collection {
    key: string;
    version: number;
    library: Library;
    links: CollectionLinks;
    meta: Meta;
    data: Data;
}

export interface Data {
    key: string;
    version: number;
    name: string;
    parentCollection: boolean;
    relations: Relations;
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

export interface CollectionLinks {
    self: Alternate;
    alternate: Alternate;
}

export interface Meta {
    numCollections: number;
    numItems: number;
}
