
export interface Image {
    id?: number;
    list_index: number;
    filename?: string;
    filetype?: string;
    url: string;
}

export interface ImageFile {
    image: Image;
    file?: File;
}
