
import { Image } from "../interfaces/Image"

export interface EventData {
    title: string;
    list_index: number;
    intro?: string;
    link_url?: string;
    link_text?: string;
}

export interface Event extends EventData {
    id: number;
    title_image?: Image;
    carousel_images?: Image[];
}