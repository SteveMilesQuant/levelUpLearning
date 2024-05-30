
export interface ImageFile {
    id?: number; // undefined indicates not yet committed to backend
    file: File;
    url: string;
}


export interface Image {
    id: number;
    list_index?: number;
    filename?: string;
    filetype?: string;
    image?: string;
}