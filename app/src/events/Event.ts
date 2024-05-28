
import { Link } from "../interfaces/Link"
import { Image } from "../interfaces/Image"

export interface EventData {
    title: string;
    list_index: number;
    intro?: string;
    link?: Link;
}

export interface Event extends EventData {
    id: number;
    title_image?: Image;
    carousel_images?: Image[];
}