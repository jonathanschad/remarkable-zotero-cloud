export interface ZoteroAccount {
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
